import { Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ApiService } from '../../core/services/api.service';
import { PostComment } from '../../core/models';

/**
 * KONZEPT 3: rxResource
 *
 * Eine Resource verbindet ein Observable mit Signals und uebernimmt dabei die
 * Arbeit, die wir in `PostList` noch von Hand gemacht haben:
 *
 *  - `params`  : reaktive Eingabe. Aendert sie sich, laeuft `stream` automatisch neu.
 *  - `stream`  : liefert das Observable (hier der HttpClient-Call).
 *  - Ergebnis  : `value()`, `isLoading()`, `error()` als fertige Signals.
 *  - `reload()`: erneutes Laden auf Knopfdruck.
 *
 * Alte Requests werden automatisch abgebrochen - kein manuelles Race-Handling
 * und kein `switchMap` noetig.
 */
@Component({
  selector: 'app-post-comments',
  imports: [],
  templateUrl: './post-comments.html',
})
export class PostComments {
  private readonly api = inject(ApiService);

  readonly postId = input.required<number>();

  protected readonly comments = rxResource({
    params: () => this.postId(),
    stream: ({ params: postId }) => this.api.loadComments(postId),
    defaultValue: [] as PostComment[],
  });
}
