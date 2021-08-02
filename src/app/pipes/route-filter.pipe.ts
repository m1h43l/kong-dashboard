import {Pipe, PipeTransform} from "@angular/core";
import {Route} from "@app/models/Route";

@Pipe({
    name: "routeFilter"
})
export class RouteFilterPipe implements PipeTransform {
    transform(values: Array<Route>, filterTerm: string, filterTags: Array<string>): Array<any> {
        const filteredByTerm: Array<Route> = [];
        if (!filterTerm) filteredByTerm.push(...values);
        else {
            for (const r of values) if (r.name?.includes(filterTerm)) filteredByTerm.push(r);
        }

        const filteredByTag: Array<Route> = [];
        if (filterTags.length === 0) filteredByTag.push(...values);
        else {
            for (const r of values) if (this.includes(filterTags, r.tags)) filteredByTag.push(r);
        }

        return filteredByTerm.filter((r) => filteredByTag.includes(r));
    }

    includes(filterTags: Array<string>, tags: Array<string>): boolean {
        if (!tags || tags.length === 0 || filterTags.length === 0) return false;

        return tags.filter((t) => filterTags.includes(t)).length > 0;
    }
}
