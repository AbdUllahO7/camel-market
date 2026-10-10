import type { ListingItem } from '../types';
import { formatPrice } from '@/core/utils/formatters';
import { OptimizedImage } from '@/core/components/Image/OptimizedImage';

export interface ListingCardProps {
  listing: ListingItem;
  onSelect?: (listing: ListingItem) => void;
}

export const ListingCard = ({ listing, onSelect }: ListingCardProps) => {
  return (
    <div
      onClick={() => onSelect?.(listing)}
      className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
    >
      {/* صورة الإبل */}
      <div className="relative w-full h-56 bg-brand-surface">
        <OptimizedImage
          src={listing.images[0]}
          alt={listing.title}
        />
        {listing.isVerified && (
          <span className="absolute top-3 right-3 bg-brand-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            ✓ مفحوص وموثق
          </span>
        )}
      </div>

      {/* تفاصيل الإبل */}
      <div className="p-4 flex flex-col gap-2 flex-grow">
        <div className="flex justify-between items-center text-xs">
          <span className="text-brand-medium">
            السلالة: {listing.breed}
          </span>
          <span className="text-brand-secondary">
            {listing.city}، {listing.country}
          </span>
        </div>

        <h3 className="text-sm font-bold text-brand-primary line-clamp-1">
          {listing.title}
        </h3>

        <div className="mt-auto pt-3 border-t border-brand-border flex justify-between items-center">
          <span className="text-base font-bold text-brand-primary">
            {formatPrice(listing.price, listing.currency)}
          </span>
          <button
            type="button"
            className="bg-brand-surface text-brand-primary border border-brand-border px-3 py-1 rounded-lg text-xs font-semibold hover:bg-brand-light/30 transition-colors"
          >
            التفاصيل
          </button>
        </div>
      </div>
    </div>
  );
};
