import {Component, OnInit} from "@angular/core";
import {Input} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AppEvent} from "@app/events/AppEvent";
import {Consumer} from "@app/models/Consumer";
import {ConsumerService} from "@app/services/consumer.service";
import {EventService} from "@app/services/event.service";
import {ToastrService} from "ngx-toastr";
import {ConsumerDialogComponent} from "../consumer-dialog/consumer-dialog.component";

@Component({
    selector: "app-consumer-card",
    templateUrl: "./consumer-card.component.html",
    styleUrls: ["./consumer-card.component.scss"]
})
export class ConsumerCardComponent implements OnInit {
    @Input() consumer: Consumer;
    waitingForDeleteConfirmation: boolean;

    constructor(
        private eventService: EventService,
        private consumerService: ConsumerService,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private window: Window
    ) {}

    ngOnInit(): void {}

    onDeleteConsumer(): void {
        this.waitingForDeleteConfirmation = true;
        setTimeout(() => {
            if (this.waitingForDeleteConfirmation) this.waitingForDeleteConfirmation = false;
        }, 3000);
    }

    onConfirmDelete(): void {
        this.waitingForDeleteConfirmation = false;

        this.consumerService.delete(this.consumer).subscribe(
            (response) => {
                this.toastr.success("Deleted consumer " + this.getConsumerName(this.consumer));
                this.eventService.send(
                    new AppEvent(AppEvent.Action.ConsumerDeleted, this.consumer)
                );
            },
            (error) => this.toastr.error("Could not delete consumer.")
        );
    }

    onEditConsumer(): void {
        const options = new MatDialogConfig();
        options.disableClose = false;
        options.autoFocus = true;
        options.data = {consumer: this.cloneConsumer(this.consumer)};

        this.dialog.open(ConsumerDialogComponent, options);
    }

    private cloneConsumer(consumer: Consumer): Consumer {
        const clone: Consumer = {id: consumer.id};

        if (consumer.username) clone.username = consumer.username;
        if (consumer.custom_id) clone.custom_id = consumer.custom_id;
        if (consumer.tags?.length > 0) clone.tags = [...consumer.tags];
        else clone.tags = [];

        return clone;
    }

    getConsumerName(consumer: Consumer): string {
        return consumer.username ? consumer.username : consumer.custom_id;
    }

    getConsumerIconName(consumer: Consumer): string {
        return consumer.username ? "person" : "help_outline";
    }

    getConsumerIconType(consumer: Consumer): string {
        return consumer.username ? "username" : "custom id";
    }
}
