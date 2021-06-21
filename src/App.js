import "./App.css";

import React, { useEffect, useState } from "react";

import { BookingList } from "./components/bookings-list";
import Dropzone from "react-dropzone";
import { convertCsvArrToJSON } from "./utils";
import csv from "csv";
import moment from "moment";
import styled from "styled-components";

const apiUrl = "http://localhost:3001";

const AppContainer = styled.div``;

const BookingWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const TimelineWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 25px;
  background-color: lightgray;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  margin-top: 15px;
`;

const SaveButton = styled.button`
  width: 75px;
  height: 40px;
`;

export const App = () => {
  const [bookings, setBookings] = useState([]);
  const [newBookings, setNewBookings] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/bookings`)
      .then((response) => response.json())
      .then(setBookings);
  }, []);

  /*
  - First, we filter the bookings based on same date and then
    if the new booking fall between start and end time of the existing bookings
   */
  const findOverlappingBookings = (newBooking) =>
    bookings
      .filter((booking) => {
        const newBookingDate = moment(newBooking.time).format("DD/MM/YYYY");
        const existingBookingDate = moment(booking.time).format("DD/MM/YYYY");

        return moment(newBookingDate).isSame(existingBookingDate);
      })
      .filter((booking) => {
        const newBookingStartTime = moment(newBooking.time).format("HH");

        const existingBookingStartTime = moment(booking.time).format("HH");
        const hoursToAdd = booking.duration / 60;

        const existingBookingEndTime = moment(booking.time)
          .add(hoursToAdd, "hours")
          .format("HH");

        return (
          newBookingStartTime >= existingBookingStartTime &&
          newBookingStartTime < existingBookingEndTime
        );
      }).length > 0;

  const onDrop = (files) => {
    const reader = new FileReader();
    reader.onload = () => {
      csv.parse(reader.result, (_err, data) => {
        const newBookings = convertCsvArrToJSON(data).map((newBooking) => {
          return {
            ...newBooking,
            isOverlapping: findOverlappingBookings(newBooking),
          };
        });

        setNewBookings(newBookings);
      });
    };

    reader.readAsBinaryString(files[0]);
  };

  const onSave = () => {
    setNewBookings([]);
    fetch(`${apiUrl}/bookings`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        newBookings.filter((booking) => !booking.isOverlapping)
      ),
    })
      .then((response) => response.json())
      .then(setBookings);
  };

  return (
    <AppContainer>
      <div className="App">
        <div className="App-header">
          <Dropzone accept=".csv" onDrop={onDrop}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Drop some files here, or click to select files</p>
                </div>
              </section>
            )}
          </Dropzone>
        </div>
      </div>
      <BookingWrapper>
        <TimelineWrapper>
          <h2>Existing bookings:</h2>
          <BookingList bookings={bookings} />
        </TimelineWrapper>
        {newBookings.length > 0 && (
          <TimelineWrapper>
            <h2>New bookings:</h2>
            <BookingList bookings={newBookings} />
          </TimelineWrapper>
        )}
      </BookingWrapper>
      <ButtonWrapper>
        <SaveButton
          onClick={onSave}
          disabled={
            newBookings.filter((booking) => !booking.isOverlapping).length === 0
          }
        >
          Save
        </SaveButton>
      </ButtonWrapper>
    </AppContainer>
  );
};
