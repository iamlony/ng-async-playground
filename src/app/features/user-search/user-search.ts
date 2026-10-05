import { Component, inject, output } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { User } from '../../core/models';
import { debounceTime, distinctUntilChanged, Observable, startWith, switchMap } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

/**
 * KONZEPT 1: Observables
 *
 * `valueChanges` ist ein Stream, der bei *jedem* Tastendruck feuert. Die
 * Operatoren formen daraus einen sinnvollen Request-Stream:
 *
 *  - `startWith('')`        : einmal initial feuern, damit die Liste nicht leer startet.
 *  - `debounceTime(300)`    : erst 300ms nach dem letzten Tastendruck weitermachen.
 *  - `distinctUntilChanged`: identische Suchbegriffe nicht doppelt abschicken.
 *  - `switchMap`            : bricht den laufenden Request ab, wenn ein neuer kommt.
 *                             Genau das kann ein Promise nicht (siehe PostList).
 *
 * Die `async`-Pipe im Template uebernimmt subscribe *und* unsubscribe.
 */
@Component({
  selector: 'app-user-search',
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './user-search.html',
})
export class UserSearch {
  private readonly api = inject(ApiService);

  readonly userSelected = output<User>();
  protected readonly search = new FormControl('', { nonNullable: true });

  users$: Observable<User[]> = this.search.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((searchTerm) => this.api.searchUsers(searchTerm)),
  );
}
