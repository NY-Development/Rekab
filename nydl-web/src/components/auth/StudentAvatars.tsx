import { memo } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarBadge } from '@/components/ui/avatar';
import { fadeInUp } from '@/components/animations/motionConfig';

// Procedurally generated identicons (dicebear), matching the same avatar
// convention already used for real accounts elsewhere in the app — not
// stand-ins for real testimonials, just decorative "learners online" chrome.
const SEEDS = ['Amara', 'Yonas', 'Selam', 'Bereket'];

/**
 * A small stack of overlapping avatars with an "online" indicator, used to
 * suggest an active, populated cohort community.
 */
function StudentAvatarsImpl() {
  return (
    <motion.div variants={fadeInUp} className="flex items-center gap-3">
      <AvatarGroup>
        {SEEDS.map((seed) => (
          <Avatar key={seed}>
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}`} alt="" />
            <AvatarFallback>{seed.slice(0, 2)}</AvatarFallback>
            <AvatarBadge className="bg-emerald-400" />
          </Avatar>
        ))}
      </AvatarGroup>
      <p className="text-xs text-primary-foreground/70">
        <span className="font-semibold text-primary-foreground">120+</span> students learning right now
      </p>
    </motion.div>
  );
}

export const StudentAvatars = memo(StudentAvatarsImpl);
