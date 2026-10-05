import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, PostComment, User } from '../models';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Ein Service, drei Stile - absichtlich:
 *   - `searchUsers`      gibt ein Observable zurueck (HttpClient).
 *   - `loadPostsByUser`  gibt ein Promise zurueck (natives fetch).
 *   - `loadComments`     gibt ein Observable zurueck, das die rxResource nutzt.
 *
 * In einer echten App wuerde man sich auf einen Stil einigen. Hier ist der
 * Unterschied das Lernziel.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  /** Observable: emittiert bei jedem Aufruf genau einmal und wird dann beendet. */
  searchUsers(term: string): Observable<User[]> {
    // `params` kodiert den Suchbegriff korrekt (Leerzeichen, Umlaute, &, ...).
    return this.http.get<User[]>(`${BASE_URL}/users`, {
      params: { name_like: term },
    });
  }

  /** Promise: startet sofort und laesst sich nicht mehr abbestellen. */
  async loadPostsByUser(userId: number): Promise<Post[]> {
    const response = await fetch(`${BASE_URL}/posts?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`Posts konnten nicht geladen werden (HTTP ${response.status})`);
    }

    return response.json() as Promise<Post[]>;
  }

  /** Observable, das in der `PostComments`-Komponente von rxResource konsumiert wird. */
  loadComments(postId: number): Observable<PostComment[]> {
    return this.http.get<PostComment[]>(`${BASE_URL}/comments`, {
      params: { postId },
    });
  }
}
