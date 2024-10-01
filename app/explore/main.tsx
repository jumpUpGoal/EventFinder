"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/app/components/card";
import { LoadingComponent } from "@/app/components/loading";
import Image from "next/image";
import Link from "next/link";
import { useEvents } from "../hooks/useEvents";
import { AutoComplete, Input, Button } from "antd";
import { CloudCog } from "lucide-react";

export const MainPage: React.FC = () => {
  // const [currentPage, setCurrentPage] = useState(2);
  // const [eventsPerPage] = useState(200);
  // const { events, paginationInfo, loading } = useEvents(
  //   currentPage,
  //   eventsPerPage
  // );
  const { events, loading } = useEvents();

  const [filteredEvents, setFilteredEvents] = useState(events);
  const [titleSearchTerm, setTitleSearchTerm] = useState("");
  const [citySearchTerm, setCitySearchTerm] = useState("");

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);
  console.log("=============events number==============", events.length);

  const titleOptions = Array.from(
    new Set(events.map((event) => event?.title))
  ).map((title) => ({ value: title, label: title }));

  const cityOptions = Array.from(
    new Set(events.map((event) => event?.city))
  ).map((city) => ({ value: city, label: city }));

  // Change page
  // const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSearch = () => {
    const filtered = events.filter(
      (event) =>
        (titleSearchTerm === "" ||
          event?.title
            ?.toLowerCase()
            .includes(titleSearchTerm.toLowerCase())) &&
        (citySearchTerm === "" ||
          event?.city?.toLowerCase().includes(citySearchTerm.toLowerCase()))
    );
    setFilteredEvents(filtered);
  };

  const handleClearSearch = () => {
    setTitleSearchTerm("");
    setCitySearchTerm("");
    setFilteredEvents(events);
  };

  return (
    <div>
      {!loading ? (
        <div className="px-6 pt-[100px] mx-auto max-w-[100rem] lg:px-8">
          {/* <div className="flex flex-row w-full items-center justify-between">
            <div className="flex items-center">
              <div className="pl-8 text-center">
                <p className="mt-4 text-white">
                  You can explore all events here.
                </p>
              </div>
            </div>
            <div className="flex space-x-4 mr-44 items-center">
              <AutoComplete
                style={{ width: 200}}
                options={titleOptions}
                filterOption={(inputValue, option) =>
                  option?.value
                    ?.toLowerCase()
                    .indexOf(inputValue.toLowerCase()) !== -1
                }
                onSelect={(value) => setTitleSearchTerm(value)}
                onChange={(value) => setTitleSearchTerm(value)}
                value={titleSearchTerm}>
                <Input size='large' style={{ width: '300px' }} placeholder="Search by title" />
              </AutoComplete>
              <div className="w-20"></div>
              <AutoComplete
                style={{ width: 200 }}
                options={cityOptions}
                filterOption={(inputValue, option) =>
                  option?.value
                    ?.toLowerCase()
                    .indexOf(inputValue.toLowerCase()) !== -1
                }
                onSelect={(value) => setCitySearchTerm(value)}
                onChange={(value) => setCitySearchTerm(value)}
                value={citySearchTerm}>
                <Input size="large" style={{ width: '300px' }} placeholder="Search by city" />
              </AutoComplete>
              <Button onClick={handleSearch} type="primary" size="large" style={{marginLeft : '150px'}}>
                Search
              </Button>
              <Button onClick={handleClearSearch} type="primary" className="hover:bg-pink-500" size="large">
                Clear
              </Button>
            </div>
          </div> */}
          <div className="flex flex-col lg:flex-row w-full items-center justify-between p-4 space-y-4 lg:space-y-0">
            <div className="w-full lg:w-auto text-center lg:text-left lg:pl-8">
              <p className="text-white">You can explore all events here.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              <AutoComplete
                className="w-full sm:w-64 lg:w-72"
                options={titleOptions}
                filterOption={(inputValue, option) =>
                  option?.value
                    ?.toLowerCase()
                    .indexOf(inputValue.toLowerCase()) !== -1
                }
                onSelect={(value) => setTitleSearchTerm(value)}
                onChange={(value) => setTitleSearchTerm(value)}
                value={titleSearchTerm}>
                <Input size="large" placeholder="Search by title" />
              </AutoComplete>
              <AutoComplete
                className="w-full sm:w-64 lg:w-72"
                options={cityOptions}
                filterOption={(inputValue, option) =>
                  option?.value
                    ?.toLowerCase()
                    .indexOf(inputValue.toLowerCase()) !== -1
                }
                onSelect={(value) => setCitySearchTerm(value)}
                onChange={(value) => setCitySearchTerm(value)}
                value={citySearchTerm}>
                <Input size="large" placeholder="Search by city" />
              </AutoComplete>
              <div className="flex space-x-4 w-full sm:w-auto">
                <Button
                  onClick={handleSearch}
                  type="primary"
                  size="large"
                  className="flex-1 sm:flex-none">
                  Search
                </Button>
                <Button
                  onClick={handleClearSearch}
                  type="primary"
                  size="large"
                  className="flex-1 sm:flex-none hover:bg-pink-500">
                  Clear
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full h-px bg-zinc-800 my-4" />
          {/* {paginationInfo && (
            <div className="flex justify-center my-4">
              <Pagination
                currentPage={currentPage}
                totalPages={paginationInfo.totalPages}
                paginate={paginate}
              />
            </div>
          )} */}

          <div
            className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-2 lg:grid-cols-4"
            style={{ fontFamily: "inherit" }}>
            {filteredEvents.map((event, key) => (
              <div key={key} className="grid grid-cols-1 gap-4 cursor-pointer">
                <Card key={1}>
                  <Link href={event?.url} target="blank">
                    <div className="cursor-pointer w-full h-[400px] relative">
                      <Image
                        className="rounded-xl overflow-hidden"
                        src={event.featureImage}
                        alt={event.title}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="px-2">
                      <h1 className="text-xl font-bold font-pop text-white">
                        {event.title}
                      </h1>
                      <h2 className="text-white">{event.venueNameData}</h2>
                      <p className="text-white">{event.eventStartDay}</p>
                      <p className="text-white">{event.eventStartTime || ""}</p>
                      <p className="text-white">{event.eventTimeZone || ""}</p>
                    </div>
                  </Link>
                </Card>
              </div>
            ))}
          </div>
          {/* {paginationInfo && (
            <div className="flex justify-center my-4">
              <Pagination
                currentPage={currentPage}
                totalPages={paginationInfo.totalPages}
                paginate={paginate}
              />
            </div>
          )} */}
        </div>
      ) : (
        <LoadingComponent />
      )}
    </div>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  paginate,
}) => {
  const pageNumbers = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="flex space-x-2">
        {currentPage > 1 && (
          <li>
            <button
              onClick={() => paginate(currentPage - 1)}
              className="px-3 py-1 rounded bg-zinc-800 text-zinc-300 hover:bg-violet-700">
              Previous
            </button>
          </li>
        )}
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded ${
                currentPage === number
                  ? "bg-violet-700 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-violet-700"
              }`}>
              {number}
            </button>
          </li>
        ))}
        {currentPage < totalPages && (
          <li>
            <button
              onClick={() => paginate(currentPage + 1)}
              className="px-3 py-1 rounded bg-zinc-800 text-zinc-300 hover:bg-violet-700">
              Next
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default MainPage;
