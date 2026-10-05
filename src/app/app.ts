import { Component, computed, signal } from '@angular/core';
import { User } from './core/models';
import { UserSearch } from './features/user-search/user-search';
import { PostList } from './features/post-list/post-list';
import { Favorites } from './features/favorites/favorites';

/**
 * Dashboard-Shell.
 *
 * Haelt nur den aktuell gewaehlten User und setzt die vier Bausteine zusammen:
 *   1. UserSearch   - Observable (valueChanges + switchMap)
 *   2. PostList     - Promise (fetch + async/await)
 *   3. PostComments - rxResource (steckt in der PostList)
 *   4. Favorites    - SignalStore
 */
@Component({
  selector: 'app-root',
  imports: [UserSearch, PostList, Favorites],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly selectedUser = signal<User | null>(null);

  /**
   * Trick fuer `@for` im Template: Durch `track user.id` baut Angular die
   * PostList komplett neu auf, sobald ein *anderer* User gewaehlt wird.
   * Damit laeuft `ngOnInit` - und damit der fetch - erneut.
   * Mit einem einfachen `@if` bliebe die alte Instanz bestehen.
   */
  protected readonly selectedUsers = computed(() => {
    const user = this.selectedUser();
    return user ? [user] : [];
  });
}
