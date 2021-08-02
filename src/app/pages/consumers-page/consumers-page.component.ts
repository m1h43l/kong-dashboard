import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {MatChip, MatChipList, MatChipListChange} from "@angular/material/chips";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConsumerDialogComponent} from "@app/components/consumer-dialog/consumer-dialog.component";
import {AppEvent} from "@app/events/AppEvent";
import {Consumer} from "@app/models/Consumer";
import {ConsumerService} from "@app/services/consumer.service";
import {EventService} from "@app/services/event.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: "app-consumers-page",
    templateUrl: "./consumers-page.component.html",
    styleUrls: ["./consumers-page.component.scss"]
})
export class ConsumersPageComponent implements OnInit {
    @ViewChild("searchField") searchField: ElementRef;
    @ViewChild(MatChipList) tagsFilterList: MatChipList;

    consumers: Array<Consumer> = [];
    filterTerm = "";
    filterTags: Array<string> = [];
    tags: Array<string> = [];

    private eventSubscription: any;

    constructor(
        private consumerService: ConsumerService,
        private eventService: EventService,
        private toastr: ToastrService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.eventSubscription = this.eventService.subscribe((event: AppEvent) => {
            switch (event.action) {
                case AppEvent.Action.Refresh:
                    this.loadConsumers();
                    break;

                case AppEvent.Action.ConsumerDeleted:
                    this.consumers.splice(this.consumers.indexOf(event.payload), 1);
                    this.consumers = [...this.consumers];
                    this.retrieveTags();
                    break;

                case AppEvent.Action.ConsumerCreated:
                    this.consumers.push(event.payload);
                    this.consumers = [...this.consumers];
                    this.sortConsumers();
                    this.retrieveTags();
                    break;

                case AppEvent.Action.ConsumerUpdated:
                    const x = this.consumers.findIndex((c) => c.id === event.payload.id);
                    if (x >= 0) this.consumers.splice(x, 1, event.payload);
                    this.consumers = [...this.consumers];
                    this.retrieveTags();
                    break;
            }
        });

        this.loadConsumers();
    }

    ngOnDestroy(): void {
        if (this.eventSubscription) this.eventSubscription.unsubscribe();
    }

    private loadConsumers(): void {
        this.consumerService.list().subscribe(
            (consumers: Array<Consumer>) => {
                this.consumers = [...consumers];
                this.sortConsumers();
                this.retrieveTags();
            },
            (error) => this.toastr.error("Could not load list of consumers.")
        );
    }

    private sortConsumers(): void {
        this.consumers.sort((c1: Consumer, c2: Consumer) => {
            const n1 = c1.username ? c1.username : c1.custom_id;
            const n2 = c2.username ? c2.username : c2.custom_id;

            return n1.localeCompare(n2);
        });
    }

    private retrieveTags(): void {
        const tags: Set<string> = new Set();

        this.consumers.forEach((c) => {
            if (c.tags) c.tags.forEach((t) => tags.add(t));
        });

        this.tags = Array.from(tags);
        this.tags.sort();
    }

    onAddConsumer(): void {
        const consumer: Consumer = {tags: []};
        const options = new MatDialogConfig();
        options.disableClose = false;
        options.autoFocus = true;
        options.data = {consumer};
        this.dialog.open(ConsumerDialogComponent, options);
    }

    onClearFilter(): void {
        this.filterTerm = "";
        this.filterTags = [];

        if (this.tagsFilterList?.selected) {
            if (this.tagsFilterList.selected instanceof MatChip)
                (this.tagsFilterList.selected as MatChip).toggleSelected();
            else
                this.tagsFilterList.selected.forEach((chip) => {
                    if (chip.selected) chip.toggleSelected();
                });
        }
    }

    onTagFilterChange(event: MatChipListChange): void {
        if (event.value && event.value.length > 0) this.filterTags = event.value;
        else this.filterTags = [];
    }
}
