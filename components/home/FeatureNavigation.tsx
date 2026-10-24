'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';

interface ThoughtItem {
  id: string;
  text: string;
  timeAgo: string;
}

export function FeatureNavigation() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Let Go ritual state
  const [worryText, setWorryText] = useState('');
  const [isReleasing, setIsReleasing] = useState(false);
  const [isReleased, setIsReleased] = useState(false);

  // Vent state
  const [ventText, setVentText] = useState('');
  const [ventSubmitted, setVentSubmitted] = useState(false);

  // Sky of thoughts sample reflections
  const [thoughts, setThoughts] = useState<ThoughtItem[]>([
    {
      id: '1',
      text: 'Watching the wind move the sunflowers tonight gave me a moment of real stillness.',
      timeAgo: '4m ago',
    },
    {
      id: '2',
      text: 'It is okay to rest today. Everything will still be here tomorrow.',
      timeAgo: '18m ago',
    },
    {
      id: '3',
      text: 'I stopped rushing for fifteen minutes. The world didn’t end.',
      timeAgo: '1h ago',
    },
  ]);
  const [newThought, setNewThought] = useState('');

  // AI Companion state
  const [chatMessages, setChatMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    {
      sender: 'ai',
      text: 'Hello. I am Miwa’s AI companion. There is no pressure here. What is on your mind today?',
    },
  ]);
  const [userChatInput, setUserChatInput] = useState('');

  const handleLetGoRelease = () => {
    if (!worryText.trim()) return;
    setIsReleasing(true);
    setTimeout(() => {
      setIsReleasing(false);
      setIsReleased(true);
      setTimeout(() => {
        setWorryText('');
        setIsReleased(false);
        setActiveModal(null);
      }, 2000);
    }, 1200);
  };

  const handlePostThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThought.trim()) return;
    setThoughts((prev) => [
      { id: Date.now().toString(), text: newThought.trim(), timeAgo: 'Just now' },
      ...prev,
    ]);
    setNewThought('');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;
    const input = userChatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: input }]);
    setUserChatInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Thank you for sharing that with me. Take a slow, deep breath. You are doing the best you can in this moment.',
        },
      ]);
    }, 800);
  };

  return (
    <>
      {/* Bottom Floating Monochrome Dock (4px grid, pill buttons, flat) */}
      <nav
        aria-label="Innerly navigation"
        className="fixed bottom-6 inset-x-0 mx-auto w-[94%] max-w-2xl z-60 flex items-center justify-center pointer-events-auto"
      >
        <div className="flex items-center space-x-1 sm:space-x-2 bg-[#000000]/90 backdrop-blur-md p-1.5 rounded-full border border-white/15 shadow-none overflow-x-auto max-w-full">
          <Button
            variant="default"
            size="sm"
            pill
            onClick={() => setActiveModal('vent')}
          >
            Vent
          </Button>

          <Button
            variant="default"
            size="sm"
            pill
            onClick={() => setActiveModal('listen')}
          >
            Listen
          </Button>

          <Button
            variant="default"
            size="sm"
            pill
            onClick={() => setActiveModal('sky')}
          >
            Sky of Thoughts
          </Button>

          <Button
            variant="solid"
            size="sm"
            pill
            onClick={() => setActiveModal('letgo')}
          >
            Let Go
          </Button>

          <Button
            variant="default"
            size="sm"
            pill
            onClick={() => setActiveModal('companion')}
          >
            AI Companion
          </Button>
        </div>
      </nav>

      {/* 1. LET GO MODAL */}
      <Modal
        isOpen={activeModal === 'letgo'}
        onClose={() => setActiveModal(null)}
        title="Let Go"
        subtitle="Write down what is weighing on you. Release it into the landscape without saving."
      >
        {isReleased ? (
          <div className="py-8 text-center animate-in fade-in zoom-in-95">
            <span className="font-serif text-[24px] italic text-white block mb-2">
              Released.
            </span>
            <p className="text-[12px] text-[#949494]">
              Your thought has drifted away into the wind. Breathe in, breathe out.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className={`transition-all duration-700 ${
                isReleasing
                  ? 'opacity-0 -translate-y-8 blur-sm pointer-events-none'
                  : 'opacity-100'
              }`}
            >
              <Textarea
                rows={4}
                value={worryText}
                onChange={(e) => setWorryText(e.target.value)}
                placeholder="Write your worry here... (nothing is stored or tracked)"
                disabled={isReleasing}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#949494]">
                Private · Never saved to disk
              </span>
              <Button
                variant="solid"
                size="md"
                pill
                onClick={handleLetGoRelease}
                disabled={!worryText.trim() || isReleasing}
              >
                {isReleasing ? 'Releasing...' : 'Release to the Sky'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* 2. VENT MODAL */}
      <Modal
        isOpen={activeModal === 'vent'}
        onClose={() => {
          setActiveModal(null);
          setVentSubmitted(false);
        }}
        title="Vent Freely"
        subtitle="Speak your unfiltered truth in an anonymous, confidential space."
      >
        {ventSubmitted ? (
          <div className="py-6 text-center">
            <span className="font-serif text-[22px] text-white block mb-2">
              Shared into the quiet.
            </span>
            <p className="text-[12px] text-[#949494] mb-4">
              Your words have been released. A listener will connect when one is available.
            </p>
            <Button
              variant="default"
              size="sm"
              pill
              onClick={() => {
                setVentText('');
                setVentSubmitted(false);
                setActiveModal(null);
              }}
            >
              Close
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Textarea
              rows={4}
              value={ventText}
              onChange={(e) => setVentText(e.target.value)}
              placeholder="What feels heavy right now?"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#949494]">
                Completely anonymous
              </span>
              <Button
                variant="solid"
                size="md"
                pill
                onClick={() => setVentSubmitted(true)}
                disabled={!ventText.trim()}
              >
                Share Anonymously
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* 3. LISTEN MODAL */}
      <Modal
        isOpen={activeModal === 'listen'}
        onClose={() => setActiveModal(null)}
        title="Be a Quiet Listener"
        subtitle="Offer your quiet attention to someone who needs to be heard."
      >
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-[8px] bg-[#000000] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium text-[12px]">
                Waiting for someone to speak
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-[#949494] leading-[1.63]">
              No advice required. Simply listening with empathy and gentleness is enough.
            </p>
          </div>
          <div className="flex justify-end">
            <Button
              variant="solid"
              size="md"
              pill
              onClick={() => setActiveModal(null)}
            >
              Enter Quiet Room
            </Button>
          </div>
        </div>
      </Modal>

      {/* 4. SKY OF THOUGHTS MODAL */}
      <Modal
        isOpen={activeModal === 'sky'}
        onClose={() => setActiveModal(null)}
        title="Sky of Thoughts"
        subtitle="Anonymous reflections from wanderers passing through the meadow."
      >
        <div className="space-y-4">
          <form onSubmit={handlePostThought} className="flex space-x-2">
            <input
              type="text"
              value={newThought}
              onChange={(e) => setNewThought(e.target.value)}
              placeholder="Leave a short thought in the sky..."
              className="flex-1 bg-[#000000] text-white text-[12px] px-3 py-2 rounded-[6px] border border-white/15 focus:outline-none placeholder:text-[#949494]"
            />
            <Button variant="solid" size="sm" pill type="submit" disabled={!newThought.trim()}>
              Post
            </Button>
          </form>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {thoughts.map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-[8px] bg-[#000000] border border-white/10"
              >
                <p className="text-white text-[12px] leading-[1.63]">{t.text}</p>
                <span className="text-[10px] text-[#949494] mt-1.5 block">
                  {t.timeAgo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* 5. AI COMPANION MODAL */}
      <Modal
        isOpen={activeModal === 'companion'}
        onClose={() => setActiveModal(null)}
        title="AI Companion"
        subtitle="A calm, supportive conversational companion. (Not a replacement for clinical care)."
      >
        <div className="space-y-4">
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-[8px] text-[12px] leading-[1.63] ${
                    msg.sender === 'user'
                      ? 'bg-white text-black font-semibold'
                      : 'bg-[#000000] text-[#FFFFFF] border border-white/15'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="flex space-x-2 pt-2 border-t border-white/10">
            <input
              type="text"
              value={userChatInput}
              onChange={(e) => setUserChatInput(e.target.value)}
              placeholder="Reply calmly..."
              className="flex-1 bg-[#000000] text-white text-[12px] px-3 py-2 rounded-[6px] border border-white/15 focus:outline-none placeholder:text-[#949494]"
            />
            <Button variant="solid" size="sm" pill type="submit" disabled={!userChatInput.trim()}>
              Send
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
}
