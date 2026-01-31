import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// Dynamic imports to ensure no server-side rendering of game components
const HostGame = dynamic(() => import('@/components/HostGame'), { ssr: false });
const PlayerGame = dynamic(() => import('@/components/PlayerGame'), { ssr: false });

export default function Game() {
  const router = useRouter();
  const { mode, hostId } = router.query;

  if (!router.isReady) return <div>Loading...</div>;

  if (mode === 'host') {
    return <HostGame />;
  }

  if (mode === 'player') {
    return <PlayerGame hostId={hostId} />;
  }

  return <div>Invalid Mode</div>;
}
