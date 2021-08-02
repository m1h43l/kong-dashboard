import {Component, OnInit} from "@angular/core";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Inject} from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {MatChipInputEvent} from "@angular/material/chips";
import {Consumer} from "@app/models/Consumer";
import {ConsumerService} from "@app/services/consumer.service";
import {EventService} from "@app/services/event.service";
import {AppEvent} from "@app/events/AppEvent";

@Component({
    selector: "app-consumer-dialog",
    templateUrl: "./consumer-dialog.component.html",
    styleUrls: ["./consumer-dialog.component.scss"]
})
export class ConsumerDialogComponent implements OnInit {
    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    readonly truthy: boolean = true;

    consumer: Consumer;

    constructor(
        private consumerService: ConsumerService,
        private eventService: EventService,
        private toastr: ToastrService,
        private dialogRef: MatDialogRef<ConsumerDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data
    ) {
        this.consumer = data.consumer;
    }

    ngOnInit(): void {}

    cancel(): void {
        this.dialogRef.close();
    }

    ok(): void {
        let consumerObservable;
        if (this.consumer.id) consumerObservable = this.consumerService.persist(this.consumer);
        else consumerObservable = this.consumerService.create(this.consumer);

        consumerObservable.subscribe(
            (consumer) => {
                if (this.consumer.id) {
                    this.toastr.success(`Consumer ${this.getConsumerName(consumer)} saved.`);
                    this.eventService.send(new AppEvent(AppEvent.Action.ConsumerUpdated, consumer));
                } else {
                    this.toastr.success(`Route ${this.getConsumerName(consumer)} created.`);
                    this.eventService.send(new AppEvent(AppEvent.Action.ConsumerCreated, consumer));
                }
                this.dialogRef.close(consumer);
            },
            (error) => this.toastr.error("Error on persisting consumer.")
        );
    }

    addTag(event: MatChipInputEvent): void {
        if (event.value) this.consumer.tags.push(event.value.trim());

        event.input!.value = "";
    }

    removeTag(tag: string): void {
        this.consumer.tags.splice(this.consumer.tags.indexOf(tag), 1);
    }

    getConsumerName(consumer: Consumer): string {
        return consumer.username ? consumer.username : consumer.custom_id;
    }
}
