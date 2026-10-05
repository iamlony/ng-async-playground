import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed } from '@angular/core';

export interface LikedPost {
  id: number;
  title: string;
  authorName: string;
}

type FavoritesState = {
  liked: LikedPost[];
};

const initialState: FavoritesState = { liked: [] };

/**
 * KONZEPT 4: SignalStore (@ngrx/signals)
 *
 *  - `withState`    : der State. Jede Property wird automatisch zum Signal.
 *  - `withComputed` : abgeleitete Werte, die sich selbst aktualisieren.
 *  - `withMethods`  : die einzigen Stellen, die den State aendern duerfen.
 *
 * `patchState` ersetzt den State immer unveraenderlich (immutable) - deshalb
 * `filter`/Spread statt `push`. Nur so merkt das Signal, dass sich etwas
 * geaendert hat.
 */

export const FavoritesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ liked }) => ({
    totalFavoritesCount: computed(() => liked().length),
    likedIds: computed(() => new Set(liked().map((post) => post.id))),
  })),

  withMethods((store) => ({
    toggleLike(post: LikedPost): void {
      const alreadyLiked = store.likedIds().has(post.id);
      patchState(store, {
        liked: alreadyLiked
          ? store.liked().filter((item) => item.id !== post.id)
          : [...store.liked(), post],
      });
    },

    isLiked(id: number): boolean {
      return store.likedIds().has(id);
    },

    clear(): void {
      patchState(store, initialState);
    },
  })),
);
