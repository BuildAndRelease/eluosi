/**
 * Animation Manager Tests
 *
 * Tests for animation lifecycle management, including start, stop, pause, and update.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AnimationManager, type Animation } from '../../src/utils/AnimationManager';

describe('AnimationManager', () => {
  let manager: AnimationManager;
  let mockOnUpdate: ReturnType<typeof vi.fn>;
  let mockOnComplete: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    manager = new AnimationManager();
    mockOnUpdate = vi.fn();
    mockOnComplete = vi.fn();
  });

  describe('start', () => {
    it('should register a new animation', () => {
      const animation: Animation = {
        id: 'test-anim',
        startTime: 0,
        duration: 1000,
        onUpdate: mockOnUpdate,
        onComplete: mockOnComplete,
        interruptible: true,
        paused: false,
      };

      manager.start(animation);
      expect(manager.getActiveCount()).toBe(1);
      expect(manager.isActive('test-anim')).toBe(true);
    });

    it('should allow multiple animations', () => {
      const anim1: Animation = {
        id: 'anim-1',
        startTime: 0,
        duration: 1000,
        onUpdate: mockOnUpdate,
        onComplete: mockOnComplete,
        interruptible: true,
        paused: false,
      };

      const anim2: Animation = {
        id: 'anim-2',
        startTime: 0,
        duration: 500,
        onUpdate: mockOnUpdate,
        onComplete: mockOnComplete,
        interruptible: false,
        paused: false,
      };

      manager.start(anim1);
      manager.start(anim2);

      expect(manager.getActiveCount()).toBe(2);
      expect(manager.isActive('anim-1')).toBe(true);
      expect(manager.isActive('anim-2')).toBe(true);
    });
  });

  describe('stop', () => {
    it('should stop a specific animation and call onComplete', () => {
      const animation: Animation = {
        id: 'test-anim',
        startTime: 0,
        duration: 1000,
        onUpdate: mockOnUpdate,
        onComplete: mockOnComplete,
        interruptible: true,
        paused: false,
      };

      manager.start(animation);
      manager.stop('test-anim');

      expect(mockOnComplete).toHaveBeenCalledOnce();
      expect(manager.getActiveCount()).toBe(0);
      expect(manager.isActive('test-anim')).toBe(false);
    });

    it('should do nothing if animation does not exist', () => {
      manager.stop('non-existent');
      expect(mockOnComplete).not.toHaveBeenCalled();
    });
  });

  describe('stopAll', () => {
    it('should stop all animations', () => {
      const onComplete1 = vi.fn();
      const onComplete2 = vi.fn();

      const anim1: Animation = {
        id: 'anim-1',
        startTime: 0,
        duration: 1000,
        onUpdate: mockOnUpdate,
        onComplete: onComplete1,
        interruptible: true,
        paused: false,
      };

      const anim2: Animation = {
        id: 'anim-2',
        startTime: 0,
        duration: 500,
        onUpdate: mockOnUpdate,
        onComplete: onComplete2,
        interruptible: false,
        paused: false,
      };

      manager.start(anim1);
      manager.start(anim2);
      manager.stopAll();

      expect(onComplete1).toHaveBeenCalledOnce();
      expect(onComplete2).toHaveBeenCalledOnce();
      expect(manager.getActiveCount()).toBe(0);
    });

    it('should stop only interruptible animations when flag is true', () => {
      const onComplete1 = vi.fn();
      const onComplete2 = vi.fn();

      const anim1: Animation = {
        id: 'anim-1',
        startTime: 0,
        duration: 1000,
        onUpdate: mockOnUpdate,
        onComplete: onComplete1,
        interruptible: true,
        paused: false,
      };

      const anim2: Animation = {
        id: 'anim-2',
        startTime: 0,
        duration: 500,
        onUpdate: mockOnUpdate,
        onComplete: onComplete2,
        interruptible: false,
        paused: false,
      };

      manager.start(anim1);
      manager.start(anim2);
      manager.stopAll(true);

      expect(onComplete1).toHaveBeenCalledOnce();
      expect(onComplete2).not.toHaveBeenCalled();
      expect(manager.getActiveCount()).toBe(1);
      expect(manager.isActive('anim-2')).toBe(true);
    });
  });

  describe('pause and resume', () => {
    it('should pause an animation', () => {
      const animation: Animation = {
        id: 'test-anim',
        startTime: 0,
        duration: 1000,
        onUpdate: mockOnUpdate,
        onComplete: mockOnComplete,
        interruptible: true,
        paused: false,
      };

      manager.start(animation);
      manager.pause('test-anim');

      // Update should not call onUpdate when paused
      manager.update(500);
      expect(mockOnUpdate).not.toHaveBeenCalled();
    });

    it('should resume a paused animation', () => {
      const animation: Animation = {
        id: 'test-anim',
        startTime: 0,
        duration: 1000,
        onUpdate: mockOnUpdate,
        onComplete: mockOnComplete,
        interruptible: true,
        paused: false,
      };

      manager.start(animation);
      manager.pause('test-anim');
      manager.resume('test-anim');

      // Update should now call onUpdate
      manager.update(500);
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should call onUpdate with correct progress', () => {
      const animation: Animation = {
        id: 'test-anim',
        startTime: 0,
        duration: 1000,
        onUpdate: mockOnUpdate,
        onComplete: mockOnComplete,
        interruptible: true,
        paused: false,
      };

      manager.start(animation);

      // 50% progress
      manager.update(500);
      expect(mockOnUpdate).toHaveBeenCalledWith(0.5);

      // 75% progress
      manager.update(750);
      expect(mockOnUpdate).toHaveBeenCalledWith(0.75);
    });

    it('should complete animation when progress reaches 1.0', () => {
      const animation: Animation = {
        id: 'test-anim',
        startTime: 0,
        duration: 1000,
        onUpdate: mockOnUpdate,
        onComplete: mockOnComplete,
        interruptible: true,
        paused: false,
      };

      manager.start(animation);
      manager.update(1000);

      expect(mockOnUpdate).toHaveBeenCalledWith(1.0);
      expect(mockOnComplete).toHaveBeenCalledOnce();
      expect(manager.getActiveCount()).toBe(0);
    });

    it('should clamp progress to 1.0 if time exceeds duration', () => {
      const animation: Animation = {
        id: 'test-anim',
        startTime: 0,
        duration: 1000,
        onUpdate: mockOnUpdate,
        onComplete: mockOnComplete,
        interruptible: true,
        paused: false,
      };

      manager.start(animation);
      manager.update(1500);

      expect(mockOnUpdate).toHaveBeenCalledWith(1.0);
      expect(mockOnComplete).toHaveBeenCalledOnce();
    });

    it('should not update paused animations', () => {
      const animation: Animation = {
        id: 'test-anim',
        startTime: 0,
        duration: 1000,
        onUpdate: mockOnUpdate,
        onComplete: mockOnComplete,
        interruptible: true,
        paused: true,
      };

      manager.start(animation);
      manager.update(500);

      expect(mockOnUpdate).not.toHaveBeenCalled();
      expect(mockOnComplete).not.toHaveBeenCalled();
    });

    it('should update multiple animations independently', () => {
      const onUpdate1 = vi.fn();
      const onUpdate2 = vi.fn();

      const anim1: Animation = {
        id: 'anim-1',
        startTime: 0,
        duration: 1000,
        onUpdate: onUpdate1,
        onComplete: vi.fn(),
        interruptible: true,
        paused: false,
      };

      const anim2: Animation = {
        id: 'anim-2',
        startTime: 0,
        duration: 500,
        onUpdate: onUpdate2,
        onComplete: vi.fn(),
        interruptible: false,
        paused: false,
      };

      manager.start(anim1);
      manager.start(anim2);
      manager.update(250);

      expect(onUpdate1).toHaveBeenCalledWith(0.25);
      expect(onUpdate2).toHaveBeenCalledWith(0.5);
    });
  });

  describe('getActiveCount', () => {
    it('should return 0 when no animations are active', () => {
      expect(manager.getActiveCount()).toBe(0);
    });

    it('should return correct count of active animations', () => {
      const anim1: Animation = {
        id: 'anim-1',
        startTime: 0,
        duration: 1000,
        onUpdate: mockOnUpdate,
        onComplete: mockOnComplete,
        interruptible: true,
        paused: false,
      };

      const anim2: Animation = {
        id: 'anim-2',
        startTime: 0,
        duration: 500,
        onUpdate: mockOnUpdate,
        onComplete: mockOnComplete,
        interruptible: false,
        paused: false,
      };

      manager.start(anim1);
      expect(manager.getActiveCount()).toBe(1);

      manager.start(anim2);
      expect(manager.getActiveCount()).toBe(2);

      manager.stop('anim-1');
      expect(manager.getActiveCount()).toBe(1);
    });
  });

  describe('isActive', () => {
    it('should return false for non-existent animation', () => {
      expect(manager.isActive('non-existent')).toBe(false);
    });

    it('should return true for active animation', () => {
      const animation: Animation = {
        id: 'test-anim',
        startTime: 0,
        duration: 1000,
        onUpdate: mockOnUpdate,
        onComplete: mockOnComplete,
        interruptible: true,
        paused: false,
      };

      manager.start(animation);
      expect(manager.isActive('test-anim')).toBe(true);
    });

    it('should return false after animation is stopped', () => {
      const animation: Animation = {
        id: 'test-anim',
        startTime: 0,
        duration: 1000,
        onUpdate: mockOnUpdate,
        onComplete: mockOnComplete,
        interruptible: true,
        paused: false,
      };

      manager.start(animation);
      manager.stop('test-anim');
      expect(manager.isActive('test-anim')).toBe(false);
    });
  });
});
