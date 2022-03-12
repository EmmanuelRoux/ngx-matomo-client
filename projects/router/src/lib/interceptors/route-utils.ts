import { ActivatedRouteSnapshot } from '@angular/router';

function findChildRoute(
  route: ActivatedRouteSnapshot,
  outlet: string
): ActivatedRouteSnapshot | undefined {
  return route.children.find(child => child.outlet === outlet);
}

export function getLeafRoute(
  route: ActivatedRouteSnapshot,
  outlet: string
): ActivatedRouteSnapshot {
  const child = findChildRoute(route, outlet);

  return child ? getLeafRoute(child, outlet) : route;
}
