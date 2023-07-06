interface NotionOperationParams {
  toolTypes: ToolType;
  blockAppendParamTypes?: {
    blockId: string;
    blockUi?: {
      blockValues?: {
        type?: string;
        richText?: boolean;
        textContent?: string;
        text?: {
          text?: {
            textType?: 'equation' | 'mention' | 'text';
            text?: string;
            isLink?: boolean;
            textLink?: string;
            mentionType?: 'database' | 'date' | 'page' | 'user';
            user?: string;
            page?: string;
            database: string;
            range?: boolean;
            date?: string;
            dateStart?: string;
            dateEnd?: string;
            expression?: string;
            annotationUi?: {
              bold?: boolean;
              italic?: boolean;
              strikethrough?: boolean;
              underline?: boolean;
              code?: boolean;
              color?:
                | 'default'
                | 'gray'
                | 'brown'
                | 'orange'
                | 'yellow'
                | 'green'
                | 'blue'
                | 'purple'
                | 'pink'
                | 'red'
                | 'gray_background'
                | 'brown_background'
                | 'orange_background'
                | 'yellow_background'
                | 'green_background'
                | 'blue_background'
                | 'purple_background'
                | 'pink_background'
                | 'red_background';
            };
          };
        };
        checked?: boolean;
        title?: string;
        url?: string;
      };
    };
  };
  blockGetAllParamTypes?: {
    blockId: string;
    returnAll?: boolean;
    limit?: number;
  };
  databaseGetParamTypes?: {
    databaseId: string;
    simple?: boolean;
  };
  databaseGetAllParamTypes?: {
    returnAll?: boolean;
    limit?: number;
    simple?: boolean;
  };
  databaseSearchParamTypes?: {
    text?: string;
    returnAll?: boolean;
    limit?: number;
    simple?: boolean;
    options?: {
      sort?: {
        sortValue?: {
          direction?: 'ascending' | 'descending';
          timestamp?: 'last_edited_time';
        };
      };
    };
  };
  databasePageCreateParamTypes?: {
    databaseId: string;
    title?: string;
    simple?: boolean;
    propertiesUi?: {
      propertyValues?: {
        key?: string;
        type?: boolean;
        title?: string;
        richText?: boolean;
        textContent?: string;
        text?: {
          text?: {
            textType?: 'equation' | 'mention' | 'text';
            text?: string;
            isLink?: boolean;
            textLink?: string;
            mentionType?: 'database' | 'date' | 'page' | 'user';
            user?: string;
            page?: string;
            database: string;
            range?: boolean;
            date?: string;
            dateStart?: string;
            dateEnd?: string;
            expression?: string;
            annotationUi?: {
              bold?: boolean;
              italic?: boolean;
              strikethrough?: boolean;
              underline?: boolean;
              code?: boolean;
              color?:
                | 'default'
                | 'gray'
                | 'brown'
                | 'orange'
                | 'yellow'
                | 'green'
                | 'blue'
                | 'purple'
                | 'pink'
                | 'red'
                | 'gray_background'
                | 'brown_background'
                | 'orange_background'
                | 'yellow_background'
                | 'green_background'
                | 'blue_background'
                | 'purple_background'
                | 'pink_background'
                | 'red_background';
            };
          };
        };
        phoneValue?: string;
        multiSelectValue?: string[];
        selectValue?: string;
        statusValue?: string;
        emailValue?: string;
        ignoreIfEmpty?: boolean;
        urlValue?: string;
        peopleValue?: string[];
        relationValue?: string;
        checkboxValue?: boolean;
        numberValue?: number;
        range?: boolean;
        includeTime?: boolean;
        date?: string;
        dateStart?: string;
        dateEnd?: string;
        timezone?: string;
        fileUrls?: {
          fileUrl?: {
            name?: string;
            url?: string;
          };
        };
      };
    };
    blockUi?: {
      blockValues?: {
        type?: string;
        richText?: boolean;
        textContent?: string;
        text?: {
          text?: {
            textType?: 'equation' | 'mention' | 'text';
            text?: string;
            isLink?: boolean;
            textLink?: string;
            mentionType?: 'database' | 'date' | 'page' | 'user';
            user?: string;
            page?: string;
            database: string;
            range?: boolean;
            date?: string;
            dateStart?: string;
            dateEnd?: string;
            expression?: string;
            annotationUi?: {
              bold?: boolean;
              italic?: boolean;
              strikethrough?: boolean;
              underline?: boolean;
              code?: boolean;
              color?:
                | 'default'
                | 'gray'
                | 'brown'
                | 'orange'
                | 'yellow'
                | 'green'
                | 'blue'
                | 'purple'
                | 'pink'
                | 'red'
                | 'gray_background'
                | 'brown_background'
                | 'orange_background'
                | 'yellow_background'
                | 'green_background'
                | 'blue_background'
                | 'purple_background'
                | 'pink_background'
                | 'red_background';
            };
          };
        };
        checked?: boolean;
        title?: string;
        url?: string;
      };
    };
    options?: {
      iconType?: 'emoji' | file;
      icon?: string;
    };
  };
  databasePageUpdateParamTypes?: {
    pageId: string;
    simple?: boolean;
    propertiesUi?: {
      propertyValues?: {
        key?: string;
        type?: boolean;
        title?: string;
        richText?: boolean;
        textContent?: string;
        text?: {
          text?: {
            textType?: 'equation' | 'mention' | text;
            text?: string;
            isLink?: boolean;
            textLink?: string;
            mentionType?: 'database' | 'date' | 'page' | user;
            user?: string;
            page?: string;
            database: string;
            range?: boolean;
            date?: string;
            dateStart?: string;
            dateEnd?: string;
            expression?: string;
            annotationUi?: {
              bold?: boolean;
              italic?: boolean;
              strikethrough?: boolean;
              underline?: boolean;
              code?: boolean;
              color?:
                | 'default'
                | 'gray'
                | 'brown'
                | 'orange'
                | 'yellow'
                | 'green'
                | 'blue'
                | 'purple'
                | 'pink'
                | 'red'
                | 'gray_background'
                | 'brown_background'
                | 'orange_background'
                | 'yellow_background'
                | 'green_background'
                | 'blue_background'
                | 'purple_background'
                | 'pink_background'
                | red_background;
            };
          };
        };
        phoneValue?: string;
        multiSelectValue?: string[];
        selectValue?: string;
        statusValue?: string;
        emailValue?: string;
        ignoreIfEmpty?: boolean;
        urlValue?: string;
        peopleValue?: string[];
        relationValue?: string;
        checkboxValue?: boolean;
        numberValue?: number;
        range?: boolean;
        includeTime?: boolean;
        date?: string;
        dateStart?: string;
        dateEnd?: string;
        timezone?: string;
        fileUrls?: {
          fileUrl?: {
            name?: string;
            url?: string;
          };
        };
      };
    };
  };
  databasePageGetParamTypes?: {
    pageId: string;
    simple?: boolean;
  };
  databasePageGetAllParamTypes?: {
    databaseId: string;
    returnAll?: boolean;
    limit?: number;
    simple?: boolean;
    filterType?: 'none' | 'manual' | json;
    matchType?: 'anyFilter' | allFilters;
    filters?: {
      conditions?: {
        key?: string;
        type?: boolean;
        condition?:
          | 'equals'
          | 'before'
          | 'after'
          | 'on_or_before'
          | 'is_empty'
          | 'is_not_empty'
          | 'on_or_after'
          | 'past_week'
          | 'past_month'
          | 'past_year'
          | 'next_week'
          | 'next_month'
          | next_year;
        returnType?: 'text' | 'checkbox' | 'number' | date;
        titleValue?: string;
        richTextValue?: string;
        phoneNumberValue?: string;
        multiSelectValue?: string;
        selectValue?: string;
        statusValue?: string;
        emailValue?: string;
        urlValue?: string;
        peopleValue?: string;
        createdByValue?: string;
        lastEditedByValue?: string;
        relationValue?: string;
        checkboxValue?: boolean;
        numberValue?: number;
        date?: string;
        createdTimeValue?: string;
        lastEditedTime?: string;
        textValue?: string;
        dateValue?: string;
      };
    };
    jsonNotice?: notice;
    filterJson?: string;
    options?: {
      downloadFiles?: boolean;
      filter?: {
        singleCondition?: {
          key?: string;
          type?: boolean;
          condition?:
            | 'equals'
            | 'before'
            | 'after'
            | 'on_or_before'
            | 'is_empty'
            | 'is_not_empty'
            | 'on_or_after'
            | 'past_week'
            | 'past_month'
            | 'past_year'
            | 'next_week'
            | 'next_month'
            | next_year;
          returnType?: 'text' | 'checkbox' | 'number' | date;
          titleValue?: string;
          richTextValue?: string;
          phoneNumberValue?: string;
          multiSelectValue?: string;
          selectValue?: string;
          statusValue?: string;
          emailValue?: string;
          urlValue?: string;
          peopleValue?: string;
          createdByValue?: string;
          lastEditedByValue?: string;
          relationValue?: string;
          checkboxValue?: boolean;
          numberValue?: number;
          date?: string;
          createdTimeValue?: string;
          lastEditedTime?: string;
          textValue?: string;
          dateValue?: string;
        };
        multipleCondition?: {
          condition?: {
            or?: {
              key?: string;
              type?: boolean;
              condition?:
                | 'equals'
                | 'before'
                | 'after'
                | 'on_or_before'
                | 'is_empty'
                | 'is_not_empty'
                | 'on_or_after'
                | 'past_week'
                | 'past_month'
                | 'past_year'
                | 'next_week'
                | 'next_month'
                | next_year;
              returnType?: 'text' | 'checkbox' | 'number' | date;
              titleValue?: string;
              richTextValue?: string;
              phoneNumberValue?: string;
              multiSelectValue?: string;
              selectValue?: string;
              statusValue?: string;
              emailValue?: string;
              urlValue?: string;
              peopleValue?: string;
              createdByValue?: string;
              lastEditedByValue?: string;
              relationValue?: string;
              checkboxValue?: boolean;
              numberValue?: number;
              date?: string;
              createdTimeValue?: string;
              lastEditedTime?: string;
              textValue?: string;
              dateValue?: string;
            };
            and?: {
              key?: string;
              type?: boolean;
              condition?:
                | 'equals'
                | 'before'
                | 'after'
                | 'on_or_before'
                | 'is_empty'
                | 'is_not_empty'
                | 'on_or_after'
                | 'past_week'
                | 'past_month'
                | 'past_year'
                | 'next_week'
                | 'next_month'
                | next_year;
              returnType?: 'text' | 'checkbox' | 'number' | date;
              titleValue?: string;
              richTextValue?: string;
              phoneNumberValue?: string;
              multiSelectValue?: string;
              selectValue?: string;
              statusValue?: string;
              emailValue?: string;
              urlValue?: string;
              peopleValue?: string;
              createdByValue?: string;
              lastEditedByValue?: string;
              relationValue?: string;
              checkboxValue?: boolean;
              numberValue?: number;
              date?: string;
              createdTimeValue?: string;
              lastEditedTime?: string;
              textValue?: string;
              dateValue?: string;
            };
          };
        };
      };
      sort?: {
        sortValue?: {
          timestamp?: boolean;
          key?: 'created_time' | last_edited_time;
          type?: boolean;
          direction?: 'ascending' | descending;
        };
      };
    };
  };
  pageArchiveParamTypes?: {
    pageId: string;
    simple?: boolean;
  };
  pageCreateParamTypes?: {
    pageId: string;
    title: string;
    simple?: boolean;
    blockUi?: {
      blockValues?: {
        type?: string;
        richText?: boolean;
        textContent?: string;
        text?: {
          text?: {
            textType?: 'equation' | 'mention' | text;
            text?: string;
            isLink?: boolean;
            textLink?: string;
            mentionType?: 'database' | 'date' | 'page' | user;
            user?: string;
            page?: string;
            database: string;
            range?: boolean;
            date?: string;
            dateStart?: string;
            dateEnd?: string;
            expression?: string;
            annotationUi?: {
              bold?: boolean;
              italic?: boolean;
              strikethrough?: boolean;
              underline?: boolean;
              code?: boolean;
              color?:
                | 'default'
                | 'gray'
                | 'brown'
                | 'orange'
                | 'yellow'
                | 'green'
                | 'blue'
                | 'purple'
                | 'pink'
                | 'red'
                | 'gray_background'
                | 'brown_background'
                | 'orange_background'
                | 'yellow_background'
                | 'green_background'
                | 'blue_background'
                | 'purple_background'
                | 'pink_background'
                | red_background;
            };
          };
        };
        checked?: boolean;
        title?: string;
        url?: string;
      };
    };
    options?: {
      iconType?: 'emoji' | file;
      icon?: string;
    };
  };
  pageGetParamTypes?: {
    pageId: string;
    simple?: boolean;
  };
  pageSearchParamTypes?: {
    text?: string;
    returnAll?: boolean;
    limit?: number;
    simple?: boolean;
    options?: {
      filter?: {
        filters?: {
          property?: object;
          value?: 'database' | page;
        };
      };
      sort?: {
        sortValue?: {
          direction?: 'ascending' | descending;
          timestamp?: string;
        };
      };
    };
  };
  userGetParamTypes?: {
    userId: string;
  };
  userGetAllParamTypes?: {
    returnAll?: boolean;
    limit?: number;
  };
}
