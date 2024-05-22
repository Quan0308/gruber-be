import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { Booking } from "../entities";

@EventSubscriber()
export class BookingSubscriber implements EntitySubscriberInterface<Booking> {
  listenTo(): string | Function {
    return Booking;
  }

  beforeInsert(event: InsertEvent<Booking>): void | Promise<any> {
    if (event.entity.orderedById) {
      event.entity.createdBy = event.entity.orderedById;
      event.entity.updatedBy = event.entity.orderedById;
    }
  }
}
