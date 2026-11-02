import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '@/components/common/States';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="pt-20">
      <EmptyState icon={Compass} title="Off course" message="We couldn’t find that page. Take the reciprocal heading back home." action={<Button asChild><Link to="/">Go Home</Link></Button>} />
    </div>
  );
}
