import { Component, signal } from '@angular/core';
import { User } from './core/models';
import { UserSearch } from './features/user-search/user-search';
import { PostList } from './features/post-list/post-list';
import { Favorites } from './features/favorites/favorites';

/**
 * Shell mit zwei Ansichten:
 *   kein User gewaehlt -> UserSearch   (Konzept 1: Observable)
 *   User gewaehlt      -> PostList     (Konzept 2: Promise, enthaelt Konzept 3)
 *
 * Die Favoriten (Konzept 4: SignalStore) stehen daneben und bleiben immer
 * sichtbar - so sieht man den Zaehler live hochgehen.
 *
 * Nebeneffekt des Umschaltens: "Zurueck" setzt `selectedUser` auf null, damit
 * wird die PostList zerstoert. Beim naechsten User entsteht eine neue Instanz
 * und `ngOnInit` laedt von selbst neu.
 */
@Component({
  selector: 'app-root',
  imports: [UserSearch, PostList, Favorites],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly selectedUser = signal<User | null>(null);
}
