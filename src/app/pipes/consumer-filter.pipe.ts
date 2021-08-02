import {Pipe, PipeTransform} from "@angular/core";
import {Consumer} from "@app/models/Consumer";

@Pipe({
    name: "consumerFilter"
})
export class ConsumerFilterPipe implements PipeTransform {
    transform(values: Array<Consumer>, filterTerm: string, filterTags: Array<string>): Array<any> {
        const filteredByTerm: Array<Consumer> = [];
        if (!filterTerm) filteredByTerm.push(...values);
        else {
            for (const c of values) {
                const name = c.username ? c.username : c.custom_id;
                if (name.includes(filterTerm)) filteredByTerm.push(c);
            }
        }

        const filteredByTag: Array<Consumer> = [];
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
