import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class HoverInfoService {
  rangeStartInfo = `Input field 'Range End' can be modified during the 'fixed time' mode. If it's the only
field modified on submit, the range will stretch/shrink keeping the 'Range Start' time unchanged.
Time span between these two input fields will be reflected in the 'Range Span' value.`;

  rangeEndInfo = `Input field 'Range Start' can be modified during 'fixed time' mode. If it's the
only field modified on submit, the time window will move without changing its time span.
'Range End' input field will be therefore updated with new time calculated
as: 'Range Start' - 'Range Span'.`;

  rangeDiffInfo = `Input field 'Range Span' shows time span between 'Range End' input field value and 'Range Start'
input field value. It can be modified during the 'real time' mode.`;

  recvCount = `Number of points in currently displayed data set.`;

  recvPastDelay = `Time gap between the timestamp of the oldest telemetry value currently displayed
and the 'Range End' time.`;

  recvPresentDelay = `Time gap between the 'Range Start' time and the timestamp of the newest telemetry value
currently displayed. If the clock of the web browser are in significant delay to the clock of the
spacecraft, this value will become negative.`;

  recvDiff = `Time span of currently displayed data set. (Calculated as difference between the earliest and the
latest timestamp of the data set).`;

  constructor() {}
}
