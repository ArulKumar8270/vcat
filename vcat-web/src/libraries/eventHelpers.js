export function getEventOrganizerNames(arr) {
  let nameString = "";
  if (arr && arr.length > 0) {
    for (const [i, data] of arr.entries()) {
      const { speaker } = data;
      // const { name } = data;
      if (i === arr.length - 1) {
        nameString += speaker;
      } else {
        nameString += `${speaker}, `;
      }
    }
  } else {
    nameString = "-";
  }
  if (nameString.length > 31) {
    const slicedString = nameString.slice(18, nameString.length);
    const replacedString = nameString.replace(slicedString, "...");
    return replacedString;
  }
  return nameString;
}

export function handleViewEventDetails(
  { id,
    name,
    image,
    from_date,
    venue,
    organizer_details,
    description,
    event_tags,
    upcomingEventsArr,
    isRegister = false,
    isEventDetailsPage = false,
    organizerNameFn,
    jsonfn,
    routerHistory,
    originalData,
    event_speakers,
    mobileDimension,
    mobileUpcomingEvents,
    mobileRelatedEvents,
    relatedEvents,
    history,
    event_for, }
) {
  const obj = {};
  obj["id"] = id;
  obj["name"] = name;
  obj["image"] = image;
  obj["from_date"] = from_date;
  obj["venue"] = venue;
  obj["organizer_details"] = organizer_details;
  obj["description"] = description;
  obj["event_tags"] = event_tags;
  obj["event_speakers"] = event_speakers;
  obj["event_for"] = event_for;
  // obj["getEventOrganizerNames"] = getEventOrganizerNames(organizer_details);

  if (isRegister) {
    if (isEventDetailsPage) {
      let parentArr = [];
      let childArr = [];
      let mainUpcomingEventsArr = [];

      if (mobileDimension) {
        if (upcomingEventsArr && upcomingEventsArr.length > 0) {
          for (const parentData of upcomingEventsArr) {
            if (id !== parentData.id) parentArr.push({ ...parentData });
          }
          mainUpcomingEventsArr = [...parentArr];
        } else {
          mainUpcomingEventsArr = [...upcomingEventsArr];
        }
      } else {
        if (originalData && originalData.length > 0) {
          for (const parentData of originalData) {
            for (const eventData of parentData) {
              if (id !== eventData.id) childArr.push({ ...eventData });
            }
            if (childArr.length !== 0) parentArr.push([...childArr]);
            childArr = [];
          }
          mainUpcomingEventsArr = [...parentArr];
        } else {
          mainUpcomingEventsArr = [...originalData];
        }
      }
      obj["otherEvents"] = mainUpcomingEventsArr;
      obj["originalOtherEvents"] = [...originalData];
    } else {
      let parentArr = [];
      let childArr = [];
      let mainUpcomingEventsArr = [];
      if (mobileDimension) {
        if (mobileUpcomingEvents && mobileUpcomingEvents.length > 0) {
          for (const parentData of mobileUpcomingEvents) {
            if (id !== parentData.id) parentArr.push({ ...parentData });
          }
          mainUpcomingEventsArr = [...parentArr];
        } else {
          mainUpcomingEventsArr = [...mobileUpcomingEvents];
        }
      } else {
        if (upcomingEventsArr && upcomingEventsArr.length > 0) {
          for (const parentData of upcomingEventsArr) {
            for (const eventData of parentData) {
              if (id !== eventData.id) childArr.push({ ...eventData });
            }
            if (childArr.length !== 0) parentArr.push([...childArr]);
            childArr = [];
          }
          mainUpcomingEventsArr = [...parentArr];
        } else {
          mainUpcomingEventsArr = [...upcomingEventsArr];
        }
      }

      obj["otherEvents"] = [...mainUpcomingEventsArr];
      obj["originalOtherEvents"] = [...upcomingEventsArr];
    }
  } else {
    if (isEventDetailsPage) {
      let parentArr = [];
      let childArr = [];
      let mainRelatedEventsArr = [];
      let objectIndex = -1;
      if (mobileDimension) {
        if (upcomingEventsArr && upcomingEventsArr.length > 0) {
          for (const parentData of upcomingEventsArr) {
            if (id === parentData.id) {
              objectIndex = upcomingEventsArr.indexOf(parentData);
            }
          }
          if (objectIndex !== -1) {
            for (const parentData of upcomingEventsArr) {
              if (id !== parentData.id) {
                if (parentData.event_tags && parentData.event_tags.length > 0) {
                  for (const eventTag of parentData.event_tags) {
                    if (
                      upcomingEventsArr[objectIndex].event_tags &&
                      upcomingEventsArr[objectIndex].event_tags.length > 0 &&
                      upcomingEventsArr[objectIndex].event_tags.includes(
                        eventTag
                      )
                    ) {
                      parentArr.push({ ...parentData });
                    }
                  }
                }
              }
            }
          } else {
            parentArr = [];
          }
          mainRelatedEventsArr = [...parentArr];
        } else {
          mainRelatedEventsArr = [...upcomingEventsArr];
        }
        obj["originalRelatedEvents"] = [...upcomingEventsArr];
        // ////////////////////////////////////
        // if (upcomingEventsArr && upcomingEventsArr.length > 0) {
        //   for (const parentData of upcomingEventsArr) {
        //     if (id !== parentData.id) parentArr.push({ ...parentData });
        //   }
        //   mainRelatedEventsArr = [...parentArr];
        // }
        // else {
        //   mainRelatedEventsArr = [...upcomingEventsArr];
        // }
      } else {
        if (originalData && originalData.length > 0) {
          for (const parentData of originalData) {
            for (const eventData of parentData) {
              if (id !== eventData.id) childArr.push({ ...eventData });
            }
            if (childArr.length !== 0) parentArr.push([...childArr]);
            childArr = [];
          }
          mainRelatedEventsArr = [...parentArr];
        } else {
          mainRelatedEventsArr = [...originalData];
        }
      }

      obj["relatedEvents"] = [...mainRelatedEventsArr];
      obj["originalRelatedEvents"] = [...originalData];
    } else {
      let parentArr = [];
      let childArr = [];
      let mainRelatedEventsArr = [];
      let objectIndex = -1;
      if (mobileDimension) {
        if (mobileRelatedEvents && mobileRelatedEvents.length > 0) {
          for (const parentData of mobileRelatedEvents) {
            if (id === parentData.id) {
              objectIndex = mobileRelatedEvents.indexOf(parentData);
            }
          }
          if (objectIndex !== -1) {
            for (const parentData of mobileRelatedEvents) {
              if (id !== parentData.id) {
                if (parentData.event_tags && parentData.event_tags.length > 0) {
                  for (const eventTag of parentData.event_tags) {
                    if (
                      mobileRelatedEvents[objectIndex].event_tags &&
                      mobileRelatedEvents[objectIndex].event_tags.length > 0 &&
                      mobileRelatedEvents[objectIndex].event_tags.includes(
                        eventTag
                      )
                    ) {
                      parentArr.push({ ...parentData });
                    }
                  }
                }
              }
            }
          } else {
            parentArr = [];
          }
          mainRelatedEventsArr = [...parentArr];
        } else {
          mainRelatedEventsArr = [...mobileRelatedEvents];
        }
        obj["originalRelatedEvents"] = [...mobileRelatedEvents];
      } else {
        if (relatedEvents && relatedEvents.length > 0) {
          for (const parentData of relatedEvents) {
            for (const eventData of parentData) {
              if (id === eventData.id)
                objectIndex = parentData.indexOf(eventData);
            }

            if (objectIndex !== -1) {
              for (const eventData of parentData) {
                if (id !== eventData.id) {
                  for (const eventTag of eventData.event_tags) {
                    if (
                      parentData[objectIndex].event_tags &&
                      parentData[objectIndex].event_tags.length > 0 &&
                      parentData[objectIndex].event_tags.includes(eventTag)
                    )
                      childArr.push({ ...eventData });
                  }
                }
              }
            }
            if (childArr.length !== 0) parentArr.push([...childArr]);
            childArr = [];
          }
          mainRelatedEventsArr = [...parentArr];
        } else {
          mainRelatedEventsArr = [...relatedEvents];
        }
        obj["originalRelatedEvents"] = [...relatedEvents];
      }

      obj["relatedEvents"] = [...mainRelatedEventsArr];
      // obj["originalRelatedEvents"] = [...relatedEvents];
    }
  }
  
  // setEventDetails({ ...obj });
  if (isEventDetailsPage) {
    routerHistory.push({
      pathname: "/event_details",
      state: {
        ...obj,
        isRegister,
      },
    });
  } else {
    history.push({
      pathname: "/event_details",
      state: {
        ...obj,
        isRegister,
      },
    });
  }
  // setIsEventDetails(true);
}
