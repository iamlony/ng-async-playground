import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Post, User } from '../../core/models';
import { FavoritesStore } from '../../state/favorites.store';
import { PostComments } from '../post-comments/post-comments';

/**
 * KONZEPT 2: Promise / async-await
 *
 * Ein Promise liefert genau *einen* Wert, startet sofort und laesst sich nicht
 * abbestellen. Deshalb muessen wir hier alles selbst erledigen, was uns RxJS
 * und rxResource spaeter abnehmen:
 *
 *  - Laden in einem Lifecycle-Hook anstossen (`ngOnInit`).
 *  - Lade- und Fehlerzustand von Hand setzen.
 *  - Fehler mit try/catch/finally behandeln.
 *
 * Warum trotzdem Signals, obwohl nur einmal geladen wird?
 * Angular 21 rendert zoneless. Ohne Zone.js merkt Angular nicht, dass sich
 * nach einem `await` ein normales Feld geaendert hat - das Template wuerde nie
 * neu gerendert. Das Signal uebernimmt genau diese Benachrichtigung.
 *
 * `ngOnInit` laeuft nur einmal pro Komponenteninstanz - das reicht hier, weil
 * die Shell zwischen Suche und Posts umschaltet: Beim "Zurueck" wird diese
 * Komponente zerstoert, beim naechsten User neu erzeugt.
 */
@Component({
  selector: 'app-post-list',
  imports: [PostComments],
  templateUrl: './post-list.html',
})
export class PostList implements OnInit {
  private readonly api = inject(ApiService);
  protected readonly favorites = inject(FavoritesStore);

  readonly user = input.required<User>();

  protected readonly posts = signal<Post[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  /** Welcher Post hat gerade seine Kommentare offen? */
  protected readonly openPostId = signal<number | null>(null);

  ngOnInit(): void {
    void this.loadPosts();
  }

  protected toggleComments(postId: number): void {
    this.openPostId.update((current) => (current === postId ? null : postId));
  }

  protected toggleLike(post: Post): void {
    this.favorites.toggleLike({
      id: post.id,
      title: post.title,
      authorName: this.user().name,
    });
  }

  protected async loadPosts(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.openPostId.set(null);

    try {
      // `await` pausiert hier, bis das Promise aus dem ApiService erfuellt ist.
      const posts = await this.api.loadPostsByUser(this.user().id);
      this.posts.set(posts);
    } catch (error) {
      this.posts.set([]);
      this.errorMessage.set(
        error instanceof Error ? error.message : 'Unbekannter Fehler beim Laden der Posts.',
      );
    } finally {
      // `finally` laeuft in beiden Faellen - der Ladezustand bleibt nie haengen.
      this.isLoading.set(false);
    }
  }
}
