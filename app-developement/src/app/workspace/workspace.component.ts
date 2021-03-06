import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppLayoutService } from 'src/app/workspace/services/app-layout.service';
import { UnsubscriptionService } from '../shared/services/unsubscription.service';
import { AppletDetails, ConnectionProblem } from '../shared/types/custom.types';
import { ConnectionBrokenService } from './services/connection-broken.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {

  @ViewChildren('applet', {read: ElementRef}) applets: QueryList<ElementRef>;

  imageries: AppletDetails[] = [];
  graphs: AppletDetails[] = [];
  tables: AppletDetails[] = [];
  commanders: AppletDetails[] = [];
  maps: AppletDetails[] = [];
  //keep refrence to subscriptions to unsubscribe onDestroy
  subscriptions: Subscription[] = []
  displayLostConnection: boolean = false;
  connectionProblemCause: ConnectionProblem;

  constructor(
    private appLayoutService: AppLayoutService,
    private connectionBrokenService: ConnectionBrokenService,
    private unsubService: UnsubscriptionService,
  ) {}

  ngOnInit() {
    //subscriber for lost server connection:
    this.subscriptions[0] = this.connectionBrokenService.displayLostConnectionSubject.subscribe(info => {
      this.connectionProblemCause = info[1];
      this.displayLostConnection = info[0];
    })

    this.subscriptions[1] = this.appLayoutService.currentAppletsSubject.subscribe(currentApplets => {
      this.imageries = currentApplets.filter(x => x.appletType==='imagery').sort((a,b)=>a.id-b.id)
      this.graphs = currentApplets.filter(x => x.appletType==='graph').sort((a,b)=>a.id-b.id)
      this.tables = currentApplets.filter(x => x.appletType==='table').sort((a,b)=>a.id-b.id)
      this.commanders = currentApplets.filter(x => x.appletType==='commander').sort((a,b)=>a.id-b.id)
      this.maps = currentApplets.filter(x => x.appletType==='map').sort((a,b)=>a.id-b.id)
    })
    //scrollIntoView on appletReference click:
    this.subscriptions[2] = this.appLayoutService.scrollIntoViewSubject.subscribe(idToFocus => {
      this.applets.forEach(x => {
        if (+x.nativeElement.id === idToFocus) {
          x.nativeElement.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'})
        }
      })
    })

  }

  trackByFunction(index, item) { //so that we dont reinstanciate running applets
    return item.id;
  }

  ngOnDestroy(): void {
    // just convention, not rly needed as this component will never get destroyed
    for (let sub of this.subscriptions) {
      this.unsubService.unsubscribe(sub);
    }
  }
}
