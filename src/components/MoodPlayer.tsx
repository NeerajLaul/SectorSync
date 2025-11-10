import { useState } from 'react';
import { Music, Volume2, VolumeX, Waves, Zap, Sparkles, X } from 'lucide-react';
import { useAmbientSound } from '../hooks/useAmbientSound';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

export function MoodPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { isPlaying, currentMood, volume, playMood, togglePlayPause, changeVolume } = useAmbientSound();

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="group relative overflow-hidden rounded-full p-4 backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-110"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Music className={`w-6 h-6 relative z-10 ${isPlaying ? 'text-purple-400 animate-pulse' : 'text-white/70'}`} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 shadow-2xl transition-all duration-500 ${
          isExpanded ? 'w-80' : 'w-16'
        }`}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
        
        {/* Glow effect when playing */}
        {isPlaying && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 animate-pulse" />
        )}

        <div className="relative z-10 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="group flex items-center gap-2 transition-all duration-300"
            >
              <div className="relative">
                <Music className={`w-5 h-5 transition-colors duration-300 ${
                  isPlaying ? 'text-purple-400' : 'text-white/70'
                } ${isPlaying ? 'animate-pulse' : ''}`} />
                {isPlaying && (
                  <div className="absolute inset-0 bg-purple-500/50 blur-lg animate-pulse" />
                )}
              </div>
              {isExpanded && (
                <span className="text-sm text-white/90">Mood Sounds</span>
              )}
            </button>
            
            {isExpanded && (
              <button
                onClick={() => setIsMinimized(true)}
                className="text-white/50 hover:text-white/90 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {isExpanded && (
            <>
              {/* Mood Selection */}
              <div className="space-y-2 mb-4">
                <MoodButton
                  icon={Waves}
                  label="Calming"
                  mood="calming"
                  isActive={currentMood === 'calming'}
                  isPlaying={isPlaying && currentMood === 'calming'}
                  onClick={() => playMood('calming')}
                  color="blue"
                />
                <MoodButton
                  icon={Sparkles}
                  label="Focus"
                  mood="focus"
                  isActive={currentMood === 'focus'}
                  isPlaying={isPlaying && currentMood === 'focus'}
                  onClick={() => playMood('focus')}
                  color="purple"
                />
                <MoodButton
                  icon={Zap}
                  label="Uplifting"
                  mood="uplifting"
                  isActive={currentMood === 'uplifting'}
                  isPlaying={isPlaying && currentMood === 'uplifting'}
                  onClick={() => playMood('uplifting')}
                  color="pink"
                />
              </div>

              {/* Controls */}
              {currentMood && (
                <div className="space-y-3 pt-3 border-t border-white/10">
                  {/* Play/Pause */}
                  <button
                    onClick={togglePlayPause}
                    className="w-full py-2 rounded-lg backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isPlaying ? (
                      <>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                        <span className="text-sm">Pause</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-white/50 rounded-full" />
                        <span className="text-sm">Play</span>
                      </>
                    )}
                  </button>

                  {/* Volume Control */}
                  <div className="flex items-center gap-3">
                    <div className="text-white/70">
                      {volume === 0 ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </div>
                    <Slider
                      value={[volume * 100]}
                      onValueChange={(values) => changeVolume(values[0] / 100)}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-white/50 w-8 text-right">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface MoodButtonProps {
  icon: React.ElementType;
  label: string;
  mood: string;
  isActive: boolean;
  isPlaying: boolean;
  onClick: () => void;
  color: 'blue' | 'purple' | 'pink';
}

function MoodButton({ icon: Icon, label, isActive, isPlaying, onClick, color }: MoodButtonProps) {
  const colorClasses = {
    blue: {
      active: 'bg-blue-500/20 border-blue-400/50 text-blue-300',
      hover: 'hover:bg-blue-500/10 hover:border-blue-400/30',
      glow: 'shadow-blue-500/20',
    },
    purple: {
      active: 'bg-purple-500/20 border-purple-400/50 text-purple-300',
      hover: 'hover:bg-purple-500/10 hover:border-purple-400/30',
      glow: 'shadow-purple-500/20',
    },
    pink: {
      active: 'bg-pink-500/20 border-pink-400/50 text-pink-300',
      hover: 'hover:bg-pink-500/10 hover:border-pink-400/30',
      glow: 'shadow-pink-500/20',
    },
  };

  const colors = colorClasses[color];

  return (
    <button
      onClick={onClick}
      className={`group relative w-full p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
        isActive
          ? `${colors.active} shadow-lg ${colors.glow}`
          : `bg-white/5 border-white/10 text-white/70 ${colors.hover}`
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Icon className={`w-4 h-4 transition-transform duration-300 ${isPlaying ? 'animate-pulse scale-110' : 'group-hover:scale-110'}`} />
          {isPlaying && (
            <div className={`absolute inset-0 bg-${color}-500/50 blur-md animate-pulse`} />
          )}
        </div>
        <span className="text-sm">{label}</span>
        {isPlaying && (
          <div className="ml-auto flex gap-1">
            <div className="w-1 h-3 bg-current rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-3 bg-current rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-3 bg-current rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>
    </button>
  );
}
