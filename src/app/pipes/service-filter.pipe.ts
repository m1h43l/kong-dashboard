import {Pipe, PipeTransform} from "@angular/core";
import {Service} from "@app/models/Service";

@Pipe({
    name: "serviceFilter"
})
export class ServiceFilterPipe implements PipeTransform {
    transform(values: Array<Service>, filterTerm: string, filterTags: Array<string>): Array<any> {
        const filteredByTerm: Array<Service> = [];
        if (!filterTerm) filteredByTerm.push(...values);
        else {
            for (const s of values) if (s.name?.includes(filterTerm)) filteredByTerm.push(s);
        }

        const filteredByTag: Array<Service> = [];
        if (filterTags.length === 0) filteredByTag.push(...values);
        else {
            for (const s of values) if (this.includes(filterTags, s.tags)) filteredByTag.push(s);
        }

        return filteredByTerm.filter((s) => filteredByTag.includes(s));
    }

    includes(filterTags: Array<string>, tags: Array<string>): boolean {
        if (!tags || tags.length === 0 || filterTags.length === 0) return false;

        return tags.filter((t) => filterTags.includes(t)).length > 0;
    }
}
