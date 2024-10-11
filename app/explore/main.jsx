"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@/app/components/card";
import { LoadingComponent } from "@/app/components/loading";
import Image from "next/image";
import Link from "next/link";
import { useEvents } from "../hooks/useEvents";
import { AutoComplete, Input, Button, DatePicker } from "antd";
import { fetchWeb3event } from "../api/fetchdata";
import axios from "axios";
import moment from "moment";

const { RangePicker } = DatePicker;

export const MainPage = () => {
  const { events, loading } = useEvents();
  const [web3Data, setWeb3Data] = useState([]);

  const [filteredEvents, setFilteredEvents] = useState(events);
  const [titleSearchTerm, setTitleSearchTerm] = useState("");
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [options, setOptions] = useState([]);
  const [displayCount, setDisplayCount] = useState(60);



  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);
  console.log('en', events?.length)

  const titleOptions = Array.from(
    new Set(events.map((event) => event?.title))
  ).map((title) => ({ value: title, label: title }));



  const formatCityName = (cityName) => {
    // Remove 'city' and spaces, then capitalize only the first letter
    return cityName
      .replace(/\s*city\s*/i, '')
      .replace(/\s+/g, '')
      .toLowerCase()
      .replace(/^(.)/, match => match.toUpperCase());
  };

  const cityOptions = Array.from(
    new Set(
      events
        .map((event) => event?.city)
        .filter((city) => city && city.trim() !== "")
        .map(formatCityName)  // Apply formatting before deduplication
    )
  )
    .map((city) => ({ value: city, label: city }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const handleSearch = () => {
    const filtered = events.filter((event) => {
      const eventDate = moment(event?.date, 'YYYY-MM-DD');
      return (
        (titleSearchTerm === "" ||
          event?.title?.toLowerCase().includes(titleSearchTerm.toLowerCase())) &&
        (citySearchTerm === "" ||
          event?.city?.toLowerCase().includes(citySearchTerm.toLowerCase())) &&
        (!dateRange ||
          (eventDate.isSameOrAfter(dateRange[0], 'day') &&
            eventDate.isSameOrBefore(dateRange[1], 'day')))
      );
    });
    setFilteredEvents(filtered);
    setDisplayCount(60);
  };

  const handleClearSearch = () => {
    setTitleSearchTerm("");
    setCitySearchTerm("");
    setFilteredEvents(events);
    setDateRange(null);
    setOptions([]); // Reset options for AutoComplete
    setDisplayCount(60);
  };

  const allOptions = useMemo(() => {
    return Array.from(new Set(events.map((event) => event?.title)))
      .map((title) => ({ value: title, label: title }));
  }, [events]);

  const onSearch = (searchText) => {
    setTitleSearchTerm(searchText);
    if (searchText === "") {
      setOptions(allOptions); // Show all options when search text is empty
    } else {
      const filteredOptions = allOptions.filter((option) =>
        option.value.toLowerCase().includes(searchText.toLowerCase())
      );
      setOptions(filteredOptions);
    }
  };


  const truncateVenueName = (venueName) => {
    if (!venueName) return '';

    const commas = venueName.split(',');

    if (commas.length <= 2) {
      // If there are 2 or fewer comma-separated parts, return the whole string
      return venueName;
    } else {
      // If there are more than 2 comma-separated parts, return the first two
      return commas.slice(0, 2).join(',').trim();
    }
  };
  const inputStyle = {
    fontFamily: 'Exo',
    height: '40px',
    fontSize: '16px',
  };

  return (
    <div style={{ fontFamily: 'Exo' }}>
      {!loading ? (
        <div className="px-6 pt-[100px] mx-auto max-w-[100rem] lg:px-8">
          <div className="flex flex-col items-center w-full space-y-4 p-4 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
              <AutoComplete
                className="w-full"
                options={options}
                onSearch={onSearch}
                onSelect={(value) => setTitleSearchTerm(value)}
                onChange={(value) => setTitleSearchTerm(value)}
                value={titleSearchTerm}
              >
                <Input
                  size="large"
                  placeholder="Search by title"
                  style={inputStyle}
                />
              </AutoComplete>

              <AutoComplete
                className="w-full"
                options={cityOptions}
                filterOption={(inputValue, option) =>
                  option?.value?.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
                }
                onSelect={(value) => setCitySearchTerm(value)}
                onChange={(value) => setCitySearchTerm(value)}
                value={citySearchTerm}
              >
                <Input
                  size="large"
                  placeholder="Search by city"
                  style={inputStyle}
                />
              </AutoComplete>

              <RangePicker
                className="w-full"
                size="large"
                onChange={(dates) => {
                  setDateRange(dates ? [dates[0].startOf('day'), dates[1].endOf('day')] : null);
                }}
                value={dateRange}
                format="YYYY-MM-DD"
                style={inputStyle}
              />
            </div>

            <div className="flex space-x-4 mt-1">
              <Button
                onClick={handleSearch}
                type="default"
                size="large"
                className="bg-purple-800 text-white hover:bg-purple-900 px-8"
                style={{ fontFamily: 'Exo' }}
              >
                Search
              </Button>
              <Button
                onClick={handleClearSearch}
                type="default"
                size="large"
                className="bg-purple-800 text-white hover:bg-purple-900 px-8"
                style={{ fontFamily: 'Exo' }}
              >
                Clear
              </Button>
            </div>
          </div>
          <div className="w-full h-px bg-zinc-800 my-4" />

          <div
            className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-2 lg:grid-cols-4"
            style={{ fontFamily: "inherit" }}>
            {filteredEvents.slice(0, displayCount).map((event, key) => (
              <div key={key} className="grid grid-cols-1 gap-4 cursor-pointer">
                <Card className="">
                  <Link href={event?.url} target="blank">
                    <div className="cursor-pointer w-full h-[400px] relative">
                      <Image
                        className="rounded-t-xl overflow-hidden object-cover"
                        src={event.featureImage}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-2 rounded-b-xl">

                      <h1 className="text-2xl font-semibold text-white truncate">
                        {event.title}
                      </h1>
                      {/* {event?.venueNameData?(<p className="text-xl text-gray-300 truncate">{event?.venueNameData}</p>):(<div><br></br></div>)} */}

                      <div className="flex justify-between items-center">
                        {event?.city ? (<span className="text-2xl bg-yellow-500 text-black px-2 py-1 rounded-full">
                          {event?.city}
                        </span>) : (<div></div>)}
                        {event?.date ? (<p className="text-xl text-white truncate">{event?.date}</p>) : (<div></div>)}
                        <span className="text-xl bg-yellow-500 text-black px-2 py-1 rounded-full">
                          {event?.eventType}
                        </span>
                      </div>
                    </div>
                  </Link>
                </Card>
              </div>
            ))}
          </div>
          <div className="w-full flex justify-center mt-8">
            {displayCount < filteredEvents.length && (
              <p
                onClick={() => setDisplayCount(prevCount => prevCount + 60)}
                type="primary"
                size="large"
                className="text-white hover:text-violet-500 text-xl mb-10 hover:cursor-pointer"
              >
                More events
              </p>
            )}
          </div>
        </div>
      ) : (
        <LoadingComponent />
      )}
    </div>
  );
};


export default MainPage;