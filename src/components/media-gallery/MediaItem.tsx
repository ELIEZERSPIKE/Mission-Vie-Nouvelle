import { motion } from "framer-motion";
import { MediaItem as MediaItemType } from "./types";

interface MediaItemProps {
  item: MediaItemType;
  index: number;
  className?: string;
}

export function MediaItem({ item, index, className = "" }: MediaItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className={`relative overflow-hidden group cursor-pointer ${className}`}
    >
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors duration-300 flex items-end p-4">
        <span className="text-white text-xs uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
          {item.name}
        </span>
      </div>
      {item.description && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
          <p className="text-white text-sm">{item.description}</p>
        </div>
      )}
    </motion.div>
  );
}