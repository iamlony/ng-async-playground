import { Component, inject } from '@angular/core';
import { FavoritesStore } from '../../state/favorites.store';

/**
 * KONZEPT 4: State mit dem NgRx SignalStore
 *
 * Die drei Konzepte davor holen Daten vom Server. Hier geht es um State, der
 * *uns* gehoert: welche Posts wurden geliked?
 *
 * Der Store ist `providedIn: 'root'`, existiert also genau einmal in der App.
 * Deshalb sehen die Posts-Liste (schreibt) und dieses Panel (liest) immer
 * denselben Stand - ganz ohne Inputs oder Outputs zwischen den Komponenten.
 */
@Component({
  selector: 'app-favorites',
  imports: [],
  templateUrl: './favorites.html',
})
export class Favorites {
  protected readonly store = inject(FavoritesStore);
}
