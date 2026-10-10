# نظام الاشتراكات والمزادات — توثيق تقني

> مصدر المعلومات: كود المشروع الفعلي (Flutter). آخر تحديث: 2026-09-19

- **Base API:** `https://api.Camels.market/api/`
- **SignalR Hubs Root:** `https://api.Camels.market` (بدون `/api`)
- **Headers الأساسية:** `Accept: application/json`, `Accept-Language: ar`, `lang: ar`, `Authorization: Bearer {accessToken}`, `Content-Type: application/json` (تُحذف مع multipart)
- **شكل الاستجابة العام:**
```json
{ "data": {}, "success": true, "message": "", "statusCode": 200, "errors": [] }
```
- ملاحظة: أي استجابة تحمل `statusCode == 405` في أي مكان بالـ body يعتبرها التطبيق جلسة منتهية، فيتم تسجيل الخروج تلقائيًا والتوجيه لشاشة تسجيل الدخول.

---

## 1. أنواع المستخدمين (User Types)

```dart
enum UserRole { Admin, Customer, StoreOwner, StableOwner, Advertiser }
```

| القيمة | الوصف |
|---|---|
| `Admin` | مدير النظام |
| `Customer` | مشتري / زبون عادي |
| `StoreOwner` | صاحب متجر (بائع) |
| `StableOwner` | صاحب اسطبل (بائع) |
| `Advertiser` | معلن |

عند التسجيل (`Auth/Register`) يُرسل الدور كنص عبر حقل `RoleName` بإحدى القيم: `Customer`, `StoreOwner`, `StableOwner`, `Advertiser`.

**حالة التحقق من الحساب** (`UserVerificationStatus`):

| القيمة | المعنى |
|---|---|
| 1 | `pending` قيد المراجعة |
| 2 | `active` مُفعّل |
| 3 | `rejected` مرفوض |
| 4 | `needModification` يحتاج تعديل |

---

## 2. نظام الاشتراكات (Subscription) والباقات (Feature Plans)

يوجد نوعان منفصلان من "الاشتراك" في النظام، ويجب عدم الخلط بينهما:

1. **الاشتراك العام (`Subscription`)** — اشتراك واحد يخص الحساب ككل، وهو **شرط دخول إلزامي** للأدوار: `Customer`, `StoreOwner`, `StableOwner`, `Advertiser`. بدونه لا يمكن استخدام التطبيق.
2. **باقات الميزات (`FeaturePlan`)** — باقات مدفوعة يتم اختيارها لحظة استخدام ميزة معينة (مزاد، إعلان منتج، بث مباشر، فتح تصنيف منتجات).

### 2.1 بوابة التحقق من الاشتراك (Subscription Gate)

يغلّف `SubscriptionAccessGate` الشاشات المحمية. آلية العمل:

1. يُطبّق فقط على الأدوار: `Customer`, `StoreOwner`, `StableOwner`, `Advertiser`.
2. يستدعي `GET Subscription/GetCurrentSubscription`.
3. لو فشل الطلب بـ `statusCode == 400` والرسالة تحتوي "لا يوجد اشتراك" أو "لا يوجد اشتراك حالي" → يفتح شاشة شراء اشتراك (`AccountVerificationSubscriptionScreen`) ثم يعيد الفحص بعد الشراء.
4. أي فشل آخر → عرض `AppErrorWidget` مع زر إعادة محاولة.
5. عند النجاح → استدعاء `onAllowed` + مزامنة توكن الإشعارات مع السيرفر.

### 2.2 تدفق شراء الاشتراك (خطوات الشاشات)

```
AccountVerificationSubscriptionScreen
   → GET Subscription/GetMyPlan          (عرض تفاصيل الباقة المتاحة للدور)
   → زر "متابعة"
SubscriptionPaymentConfirmScreen
   → إدخال كوبون خصم (اختياري)
   → POST Payments/CreateSubscriptionPayment  { coupon_Code? }
   → استخراج رابط الدفع من الاستجابة (data/paymentUrl/paymentURL/url/redirectUrl/checkoutUrl)
   → لو غير موجود: GET Payments/CheckPaymentStatusTester?paymentId=
SubscriptionPaymentWebViewScreen
   → فتح WebView لرابط الدفع
   → مراقبة الـ URL بعد كل تنقل بحثًا عن الكلمات: success, succeeded, paid, captured, completed
   → عند النجاح: تسجيل خروج (إن لزم) والتوجيه لشاشة تسجيل الدخول
```

### 2.3 عرض حالة الاشتراك الحالي

شاشة "اشتراكي" (`SubsecrebtionScreen`) تستدعي:

```
GET Subscription/GetCurrentSubscription
```

**نموذج الاستجابة (`CurrentSubscription`):**

```ts
{
  subscriptionId: number,
  planName: string,
  amount: number,
  status: 1 | 2 | 3 | 4,   // 1=قيد المراجعة, 2=نشط, 3=منتهي, 4=ملغي
  isLifetime: boolean,
  startDate: DateTime,
  endDate: DateTime,
  remainingDays: number
}
```

### 2.4 أنواع باقات الميزات (Feature Plan Types)

```dart
class FeaturePlanType {
  static const int auction = 1;             // مزاد
  static const int productAdvertisement = 2; // إعلان منتج
  static const int liveStream = 3;          // بث مباشر
  static const int productPackage = 4;      // فتح تصنيف منتجات
}
```

### 2.5 جلب باقات ميزة معيّنة

```
GET FeaturePlansManagement/GetPlans?featureType={1|2|3|4}
```

الاستجابة تُخزَّن محليًا (Cache) بمفتاح `feature_plans_{featureType}` لتُستخدم عند فتح Bottom Sheet اختيار الباقة.

**نموذج `FeaturePlan`:**

```ts
{
  id: number,
  featureName: string,
  name: string,
  price: number,
  duration_Value: number,
  duration_Type: 2 | 3 | 4,   // 2=يوم, 3=أسبوع, 4=شهر
  quantity_Limit: number,
  is_Lifetime: boolean,
  isActive: boolean
}
```

### 2.6 استخدام الباقات حسب الميزة

| الميزة | نقطة التفعيل في الكود | كيف يُرسل `planId` |
|---|---|---|
| **مزاد** | زر "إنشاء مزاد" (يظهر لـ `StoreOwner`/`StableOwner` فقط) | داخل `Auctions/Create` كحقل `FeaturePlanId` |
| **إعلان منتج** | فقط لدور `Advertiser` عند إضافة منتج | كحقل `Plan_Id` عند إنشاء المنتج |
| **بث مباشر** | زر "بث مباشر" (`StoreOwner`/`StableOwner`) | كحقل `featurePlanId` إلى `LiveStreams/Start` |
| **فتح تصنيف منتجات** | من شاشة تصنيفات المتجر (تصنيف مقفول) | `POST ProductPackages/PurchasePackage?planId=&categoryId=` |

**تفاصيل تصنيفات المتجر (مفتوح/مقفول):**

```
GET Categories/GetCategoriesOpeningClosing?HasActivePackage=&PageNumber=
```

كل تصنيف يحمل: `hasActivePackage`, `packageEndDate`, `remainingProducts`, `planId`، وعلى أساسها يظهر التصنيف "مفتوح" أو "مقفول" للبائع.

### 2.7 التمايز حسب نوع اليوزر

| الدور | إضافة منتج | مزاد | بث مباشر | ملاحظات |
|---|---|---|---|---|
| `Customer` | لا يملك | يشتري فقط (مزايدة) | يشاهد فقط | يحتاج اشتراك عام فقط |
| `StoreOwner` | مباشر (بدون فحص باقة) | يحتاج باقة `auction` | يحتاج باقة `liveStream` | يظهر تبويب "بثوثي" |
| `StableOwner` | مباشر (بدون فحص باقة) | يحتاج باقة `auction` | يحتاج باقة `liveStream` | يظهر تبويب "بثوثي" |
| `Advertiser` | يحتاج باقة `productAdvertisement` | غير متاح | غير متاح | لا يظهر له تبويب المزاد/البث، بدلاً منه "إدارة منتجاتي" |

### 2.8 التعامل مع رصيد غير كافٍ

أي عملية شراء باقة (مزاد / منتج / فتح تصنيف) قد تفشل بالكود `407` أو رسالة تحتوي "الرصيد غير كافي" → يتم توجيه المستخدم مباشرة لشاشة المحفظة (`WalletScreen`).

**نقاط نهاية المحفظة:**

```
GET  Wallets/GetMyWallet
GET  Wallets/GetMyTransaction
POST Payments/CreateWalletTopupPayment   { amount }
GET  Payments/CheckPaymentStatusTester?paymentId=
```

---

## 3. نظام المزادات (Auction)

### 3.1 حالات المزاد

```dart
enum AuctionServerStatus {
  draft(1), active(2), ended(3), cancelled(4);
}
```

فلترة المشتري: `all(null)`, `active(2)`, `ended(3)`.

### 3.2 نقاط النهاية (Endpoints)

| الوظيفة | Method | Endpoint | من يستخدمها |
|---|---|---|---|
| قائمة المزادات | GET | `Auctions/GetAuctions` | Customer |
| تفاصيل مزاد | GET | `Auctions/GetById?id=` | الطرفان |
| مزايدة (تقديم عرض) | POST | `Auctions/PlaceBid` | Customer |
| إنشاء مزاد | POST (multipart) | `Auctions/Create` | Seller (StoreOwner/StableOwner) |
| مزاداتي (البائع) | GET | `Auctions/GetMyAuctions` | Seller |
| قبول أعلى عرض | POST | `Auctions/AcceptAuction?id=` | Seller |

> ملاحظة تقنية: `Auctions/AcceptAuction` يُستدعى مباشرة (Bypass لطبقة الـ Repository)، ولا يوجد endpoint مقابل للرفض رغم وجود واجهة باسم "قبول/رفض".

#### إنشاء مزاد — Request Body

```json
{
  "Title": "string",
  "Description": "string",
  "Address": "string",
  "Start_Price": 0,
  "FeaturePlanId": 0
}
```
+ ملف/ملفات صور تحت حقل `Images` (متعدد، Multipart).

**شروط الإنشاء (Client-side validation):**
- `Title`, `Address`, `Description`, `Start_Price` إلزامية (غير فارغة).
- `Start_Price` يجب أن يكون رقمًا ≥ 0.
- الحد الأقصى للصور: **6 صور** (رسالة تحذير عند التجاوز).
- يجب اختيار باقة (`FeaturePlan`) من نوع `auction` قبل الإرسال، وإن لم توجد باقات متاحة يُمنع الإرسال برسالة "لا توجد خطط متاحة لنشر المزاد".
- ملاحظة: يوجد حقل "الحد الأدنى للمزايدة" (`minimumBidIncrement`) بالواجهة لكنه **لا يُرسل فعليًا** للسيرفر — يبدو غير مكتمل.

#### تقديم مزايدة — Request Body

```
POST Auctions/PlaceBid
{ "auction_Id": 0, "amount": 0 }
```

**شرط الإرسال من الواجهة:** الحقل غير فارغ ويُحوَّل لرقم `double`. لا يوجد تحقق عميل من الحد الأدنى للزيادة — يعتمد على استجابة السيرفر. الزر يبقى مُعطَّلًا إلا إذا تحقق الشرط التالي (`canPlaceBid`):

```
activeAuctionId != null
&& auctionHubStatus == connected
&& buyerAuctionStatus == active
&& !isPlacingBid
```

### 3.3 نموذج تفاصيل المزاد (Response)

```ts
{
  id: number,
  title: string,
  description: string,
  address: string,
  currentPrice: number,
  startPrice: number,
  startTime: DateTime,
  endTime: DateTime,
  status: 1 | 2 | 3 | 4,
  bids: [
    { amount: number, createdAt: DateTime, customerId: string, customerName: string }
  ],
  images: [ { id: number, imageName: string } ],
  sellerId, sellerName, sellerPhoneNumber,
  userId, userName
}
```

### 3.4 فلاتر تصفّح المزادات

**من طرف المشتري (`GET Auctions/GetAuctions`):**
`PageNumber`, `Search` (بحث مع تأخير 500ms), `Status` (`null`=الكل, `2`=نشط, `3`=منتهي)

**من طرف البائع (`GET Auctions/GetMyAuctions`):**
`PageNumber`, `Search`, `Category_Id`, `MinBid`, `MaxBid`, `Status` — مع تبويبات (الكل / نشط الآن / منتهي)

### 3.5 التعامل مع المزاد — صاحب المزاد (Seller)

- ينشئ المزاد عبر `Auctions/Create` بعد اختيار باقة `auction` (خصم من الرصيد أو دفع).
- يرى مزاداته عبر `Auctions/GetMyAuctions` مع فلاتر.
- في شاشة تفاصيل المزاد (بعد انتهاء الوقت `isEnded` ووجود عروض):
  - تظهر له "صندوق قرار البائع" (`SellerAuctionDecisionBox`) يعرض أعلى عرض مع زر **قبول** فقط.
  - عند الضغط: `POST Auctions/AcceptAuction?id=`.
  - لا يوجد إجراء "رفض" مُنفَّذ فعليًا رغم وجود الاسم بالواجهة.
- لا يرى حقل إدخال مزايدة (مخفي للبائع).
- يرى نفس بيانات الصور، العنوان، الوصف، إحصائيات (عدد العروض، السعر الابتدائي، السعر الحالي)، وسجل المزايدات.

### 3.6 التعامل مع المزاد — المشتري (Bidder)

- يتصفح المزادات (`Auctions/GetAuctions`) بالفلاتر أعلاه.
- عند فتح تفاصيل مزاد:
  1. `GET Auctions/GetById?id=` لجلب البيانات.
  2. الانضمام لقناة الريال تايم (`joinAuction`) — انظر القسم التالي.
  3. عند مغادرة الشاشة: مغادرة القناة (`leaveCurrentAuction`).
- يقدّم عروضًا عبر `POST Auctions/PlaceBid` بشرط اتصال القناة وأن المزاد "نشط".
- يمكنه التواصل مع البائع (بدء محادثة) عبر `sellerId`/`userId` من تفاصيل المزاد.
- عند انتهاء المزاد وفوزه، لا يوجد إجراء عميل إضافي مطلوب منه (القرار يكون من البائع بالقبول).

### 3.7 آلية المزايدة والتعامل مع الريال تايم (SignalR)

المزادات تستخدم **SignalR** (حزمة `signalr_netcore`)، وليس WebSocket/Firebase عادي.

**الاتصال:**
```
Hub URL: https://api.Camels.market/auctionHub
Auth: accessTokenFactory → Bearer accessToken
Reconnect: تلقائي (withAutomaticReconnect)
```

**الانضمام/المغادرة (Invoke):**
```
invoke('JoinAuctionGroup', args: [auctionId])
invoke('LeaveAuctionGroup', args: [auctionId])
```

**الأحداث المستقبَلة (Events):**

| الحدث | البيانات | الأثر على الحالة |
|---|---|---|
| `ReceiveBidUpdate` | `{ auctionId, currentPrice, userId, amount }` | تحديث السعر الحالي وإضافة العرض لقائمة المزايدات الحية (مع تفادي التكرار) |
| `AuctionEnded` | `{ auctionId, winner, amount }` | تحويل حالة المزاد لدى المشتري إلى `ended` |
| `AuctionStopped` | `{ auctionId }` | تحويل الحالة إلى `stopped` |

**حالات الاتصال بالقناة (`AuctionHubStatus`):** `initial → connecting → connected` أو `failure`.

**حالات المزاد عند المشتري (`BuyerAuctionRealtimeStatus`):** `initial, draft, active, ended, stopped`.

**إعادة المحاولة عند فشل الاتصال:** إن فشلت القناة (`failure`) بينما حالة المزاد لا تزال `active`، تظهر واجهة "إعادة الاتصال" وتُستدعى `retryJoinAuction()` لإعادة نفس عملية الانضمام.

**عداد الوقت المتبقي:** يُحسب محليًا كل ثانية من `endTime` طالما الحالة `active`، ويتحول تلقائيًا لعرض التسمية النهائية عند الانتهاء أو تغيّر الحالة.

---

## 4. ملاحظات فنية مهمة (للفريق)

- `Auctions/AcceptAuction` غير موجود ضمن ثوابت `ApiService` (مكتوب Hardcoded) ويتجاوز طبقة الـ Repository/UseCase.
- لا يوجد endpoint فعلي لرفض العرض رغم وجود واجهة تحمل الاسم.
- حقل "الحد الأدنى للمزايدة" بواجهة إنشاء المزاد غير مُرسَل فعليًا للسيرفر حاليًا.
- نماذج `SubscriptionPlan`/`CurrentSubscription`/`FeaturePlan` تعتمد قراءة مرنة لعدة أسماء حقول محتملة (`id`/`planId`/`subscriptionPlanId`، إلخ)، مما يوحي بأن عقد الـ API لم يكن مستقرًا بالكامل وقت التطوير — يُنصح بالتأكيد مع الباك-إند على الأسماء النهائية.
- يوجد ملف توثيقي إضافي بجذر المشروع (`API_REQUESTS_WEB.md`) مكتوب مسبقًا لفريق الويب، ويتطابق مع ما تم رصده بالكود (نفس الـ Hub والأحداث).
