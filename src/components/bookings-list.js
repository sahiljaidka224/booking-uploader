import React from "react";
import { groupBy } from "../utils/index";
import moment from "moment";
import styled from "styled-components";

const DATETIME_FORMAT = "DD/MM/Y";

const SegmentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  padding-left: 25px;
  min-height: auto;
  align-items: center;
`;

const DateView = styled.span``;

const Segment = styled.div`
  margin-left: 10px;
  background-color: ${(props) => props.backgroundColor || "royalblue"};
  width: ${(props) => props.width || "25px"};
  min-height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Duration = styled.span`
  color: white;
  font-size: 12px;
`;

const getHourFromTime = (time) => {
  return moment(time).format("HH");
};

export const BookingList = ({ bookings }) => {
  const groupedBookings = groupBy(
    bookings.map((booking) => ({
      ...booking,
      date: moment(booking.time).format("DD/MM/YYYY"),
    })),
    "date"
  );

  return Object.keys(groupedBookings).map((key) => {
    const foundBookings = groupedBookings[key];

    const date = new Date(foundBookings[0].time);

    return (
      <SegmentWrapper key={key}>
        <DateView>{moment(date).format(DATETIME_FORMAT)}</DateView>
        {foundBookings
          .sort((a, b) =>
            getHourFromTime(a.time) < getHourFromTime(b.time)
              ? -1
              : getHourFromTime(a.time) > getHourFromTime(b.time)
              ? 1
              : 0
          )
          .map((booking, i) => {
            const startHour = moment(booking.time).format("hh:mm a");
            const duration = booking.duration / 60;
            return (
              <Segment
                key={i}
                width={`${duration * 35}px`}
                backgroundColor={booking.isOverlapping ? "red" : "royalBlue"}
              >
                <Duration>{`${startHour.toString()} (${duration.toString()}hrs)`}</Duration>
              </Segment>
            );
          })}
      </SegmentWrapper>
    );
  });
};
