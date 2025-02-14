'use client'
import React, { useState, useEffect, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { getAllEvents } from '@/lib/commonApi';
import ParaText from '@/app/commonUl/ParaText';
import moment from 'moment';
import ErrorHandler from '@/lib/ErrorHandler';
// import Loading from '@/ChatUI/components/Loading';
import AuthContext from '@/contexts/AuthContext';
import { Col, Row } from 'antd';
import FormModal from './FormModal';

interface TooltipState {
  content: string;
  x: number;
  y: number;
}

interface Events {
  summary: string;
  start: {
    dateTime: string | number | Date;
    date: string;
    timeZone: string;
  }
  end: {
    dateTime: string | number | Date;
    date: string;
    timeZone: string;
  }
  description: string;

}

const Calendar = () => {
  const [events, setEvents] = useState<Events[]>([]);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const { user } = useContext(AuthContext);

  const handleEventMouseEnter = (arg: { event: { title: string; extendedProps: { description: string; }; start: moment.MomentInput; end: moment.MomentInput; }; jsEvent: { clientX: number; clientY: number; }; }) => {

    // Create tooltip content
    const tooltipContent = `
    <div>
    <strong>Title:</strong> ${arg.event.title}<br>
    <strong>Description:</strong> ${arg.event.extendedProps.description}<br>
    <strong>Assigned Date:</strong> ${moment(arg.event.start).format('dddd, MMMM D')}<br>
    <strong>Assigned Time:</strong> ${moment(arg.event.start).format('hh:mm A')}<br>
    <strong>Target Date:</strong> ${moment(arg.event.end).format('dddd, MMMM D')}<br>
    <strong>Target Time:</strong> ${moment(arg.event.end).format('hh:mm A')}<br>
</div>

    `;
    // Set tooltip content and position
    setTooltip({
      content: tooltipContent,
      x: arg.jsEvent.clientX,
      y: arg.jsEvent.clientY,
    });
  };

  const handleEventMouseLeave = () => {
    setTooltip(null);
  };

  const handleEventClick = (info: any) => {
    handleEventMouseEnter(info);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents();
        setEvents(response.data);
      } catch (error) {
        ErrorHandler.showNotification(error);
      }
    };
    fetchEvents();
  }, []);
  if (!user) {
    // return <Loading />;
  }
  return (
    <>
      <div className='calendar'>
        <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
          Calendar Events
        </ParaText>
        <div style={{ marginTop: '24px' }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
              <FormModal />
            </Col>
          </Row>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events.map((event) => ({
              title: event.summary,
              description: event.description,
              start: new Date(event.start.dateTime),
              end: new Date(event.end.dateTime),
            }))}
            eventClick={handleEventClick}
            eventMouseLeave={handleEventMouseLeave}
          />
        </div>

        {tooltip && (
          <div
            style={{
              position: 'fixed',
              top: tooltip.y,
              left: tooltip.x,
              backgroundColor: 'white',
              border: '1px solid black',
              borderRadius: '8px',
              lineHeight: '23px',
              padding: '11px',
              zIndex: 9999,
              width: '20%',
            }}
            dangerouslySetInnerHTML={{ __html: tooltip.content }}
          />
        )}
      </div>
    </>
  );
};

export default Calendar;
