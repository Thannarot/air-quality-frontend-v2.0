!(function (a, b, c, d) {
    var e = function (b, c) {
        (this.elem = b), (this.$elem = a(b)), (this.options = c), (this.metadata = this.$elem.data("plugin-options"));
    };
    (e.prototype = {
        public: function () {
            return {
                startDate: moment().startOf("day"),
                endDate: moment().startOf("day"),
                format: "L",
                dateSeparator: " - ",
                calendarCount: 2,
                mobileBreakpoint: 760,
                isHotelBooking: !1,
                inline: !1,
                minDate: null,
                maxDate: null,
                showHeader: !0,
                showFooter: !0,
                rangeOrientation: "horizontal",
                verticalRangeWidth: 180,
                showButtons: !1,
                startOnMonday: !1,
                container: "body",
                oneCalendarWidth: 230,
                enableKeyboard: !0,
                showOn: "bottom",
                arrowOn: "left",
                autoAlign: !0,
                locale: moment.locale(),
                singleDate: !1,
                target: null,
                autoCloseOnSelect: !1,
                startEmpty: !1,
                isRTL: !1,
                ranges: [
                    { title: "Today", startDate: moment(), endDate: moment() },
                    { title: "3 Days", startDate: moment(), endDate: moment().add(2, "days") },
                    { title: "5 Days", startDate: moment(), endDate: moment().add(4, "days") },
                    { title: "1 Week", startDate: moment(), endDate: moment().add(6, "days") },
                    { title: "Till Next Week", startDate: moment(), endDate: moment().endOf("week") },
                    { title: "Till Next Month", startDate: moment(), endDate: moment().endOf("month") },
                ],
                rangeLabel: "Ranges: ",
                cancelLabel: "Cancel",
                applyLabel: "Apply",
                nextMonthIcon: "<i class='fa fa-arrow-right'></i>",
                prevMonthIcon: "<i class='fa fa-arrow-left'></i>",
                rangeIcon: "<i class='fa fa-retweet'></i>",
                headerSeparator: "<i class='fa fa-chevron-right'></i>",
                onbeforeselect: function () {
                    return !0;
                },
                onafterselect: function () {},
                onbeforeshow: function () {},
                onbeforehide: function () {},
                onaftershow: function () {},
                onafterhide: function () {},
                onfirstselect: function () {},
                onrangeselect: function () {},
                onbeforemonthchange: function () {
                    return !0;
                },
                onaftermonthchange: function () {},
                onafteryearchange: function () {},
                ondraw: function () {},
                onBeforeInit: function () {},
                onBeforeDestroy: function () {
                    return !0;
                },
                oninit: function () {},
                ondestroy: function () {},
                validateClick: function () {
                    return !0;
                },
                onCancel: function () {
                    return !0;
                },
                disableDays: function () {
                    return !1;
                },
                disabledRanges: [],
                continuous: !1,
                disableOnlyStart: !1,
                disableOnlyEnd: !1,
                minSelectedDays: 0,
                enableMonthSwitcher: !0,
                enableYearSwitcher: !0,
                enableSwipe: !0,
                numericMonthSwitcher: !1,
                monthSwitcherFormat: "MMMM",
                showWeekNumbers: !1,
                hideOutOfRange: !1,
                DOBCalendar: !1,
            };
        },
        private: function () {
            return {
                startSelected: !1,
                currentDate: moment().startOf("day"),
                endSelected: !0,
                hoverDate: null,
                keyboardHoverDate: null,
                headerStartDay: null,
                headerStartDate: null,
                headerStartWeekday: null,
                headerEndDay: null,
                headerEndDate: null,
                headerEndWeekday: null,
                swipeTimeout: null,
                isMobile: !1,
                valElements: ["BUTTON", "OPTION", "INPUT", "LI", "METER", "PROGRESS", "PARAM"],
                dontHideOnce: !1,
                initiator: null,
                initComplete: !1,
                startDateBackup: null,
                startDateInitial: null,
                endDateInitial: null,
                firstValueSelected: !1,
                throttleTimeout: null,
                documentEvent: null,
                delayInputUpdate: !1,
                lastScrollX: 0,
                lastScrollY: 0,
                isTicking: !1,
                parentScrollEventsAttached: !1,
                rafID: 0,
                disabledDays: {},
            };
        },
        init: function () {
            return (
                (this.config = a.extend({}, this.public(), this.options, this.metadata)),
                (this.globals = a.extend({}, this.private())),
                (this.globals.isMobile = this.checkMobile()),
                this.config.onBeforeInit(this),
                this.applyConfig(),
                this.fetchInputs(),
                this.drawUserInterface(),
                this.drawOverlay(),
                this.addInitialEvents(),
                this.addKeyboardEvents(),
                this.$elem.data("caleran", this),
                this.config.oninit(this),
                (this.globals.initComplete = !0),
                (this.globals.lastScrollX = 0),
                (this.globals.lastScrollY = 0),
                a(b).trigger("resize.caleran"),
                this
            );
        },
        validateDates: function () {
            var a;
            moment(this.config.startDate, this.config.format).isValid() && moment(this.config.endDate, this.config.format).isValid()
                ? ((this.config.startDate = moment(this.config.startDate, this.config.format).middleOfDay().locale(this.config.locale)),
                  (this.config.endDate = moment(this.config.endDate, this.config.format).middleOfDay().locale(this.config.locale)),
                  this.config.startDate.isAfter(this.config.endDate, "day") && ((a = this.config.startDate.clone()), (this.config.startDate = this.config.endDate.clone()), (this.config.endDate = a.clone()), (a = null)))
                : ((this.config.startDate = moment().middleOfDay().locale(this.config.locale)), (this.config.endDate = moment().middleOfDay().locale(this.config.locale))),
                (this.globals.currentDate = moment(this.config.startDate, this.config.format)),
                null !== this.config.minDate && moment(this.config.minDate, this.config.format).isValid() ? (this.config.minDate = moment(this.config.minDate, this.config.format).middleOfDay()) : (this.config.minDate = null),
                null !== this.config.maxDate && moment(this.config.maxDate, this.config.format).isValid() ? (this.config.maxDate = moment(this.config.maxDate, this.config.format).middleOfDay()) : (this.config.maxDate = null),
                null !== this.config.minDate &&
                    null !== this.config.maxDate &&
                    this.config.minDate.isAfter(this.config.maxDate, "day") &&
                    ((a = this.config.minDate.clone()), (this.config.minDate = this.config.maxDate.clone()), (this.config.maxDate = a.clone()), (a = null)),
                null !== this.config.minDate && null !== this.config.startDate && this.config.minDate.isAfter(this.config.startDate, "day") && (this.config.startDate = this.config.minDate.clone()),
                null !== this.config.minDate && null !== this.config.endDate && this.config.minDate.isAfter(this.config.endDate, "day") && (this.config.endDate = this.config.minDate.clone()),
                null !== this.config.maxDate && null !== this.config.startDate && this.config.maxDate.isBefore(this.config.startDate, "day") && (this.config.startDate = this.config.maxDate.clone()),
                null !== this.config.maxDate && null !== this.config.endDate && this.config.maxDate.isBefore(this.config.endDate, "day") && (this.config.endDate = this.config.maxDate.clone()),
                (!1 === this.checkRangeContinuity() ||
                    (1 == this.config.disableOnlyStart && this.isDisabled(this.config.startDate, this.config.isHotelBooking)) ||
                    (!1 === this.config.singleDate && this.config.disableOnlyEnd && this.isDisabled(this.config.endDate, this.config.isHotelBooking)) ||
                    (this.config.startEmpty && 0 == this.globals.firstValueSelected)) &&
                    this.clearInput();
        },
        applyConfig: function () {
            null === this.config.target && (this.config.target = this.$elem),
                !0 === this.config.inline && (this.config.DOBCalendar = !1),
                1 == this.config.DOBCalendar && (this.config.singleDate = !0),
                ["startDate", "endDate", "minDate", "maxDate"].forEach(function (a) {
                    this.config[a] = this.fixDateTime(this.config[a]);
                }, this),
                this.config.ranges.map(function (a) {
                    return (a.startDate = this.fixDateTime(a.startDate)), (a.endDate = this.fixDateTime(a.endDate)), a;
                }, this),
                !1 === this.globals.isMobile
                    ? (!0 === this.config.inline
                          ? ((this.container = this.$elem.wrapAll("<div class='caleran-container caleran-inline' tabindex='1' onclick=''></div>").parent()),
                            (this.input = a("<div class='caleran-input'></div>").appendTo(this.container)),
                            (this.elem.type = "hidden"),
                            (this.config.showButtons = !1),
                            this.setViewport())
                          : ((this.container = a("<div class='caleran-container caleran-popup' style='display: none;' onclick=''><div class='caleran-box-arrow-top'></div></div>").appendTo(this.config.container)),
                            (this.input = a("<div class='caleran-input'></div>").appendTo(this.container)),
                            this.config.showButtons && ((this.globals.delayInputUpdate = !0), (this.config.autoCloseOnSelect = !1))),
                      "horizontal" === this.config.rangeOrientation
                          ? this.input.css("width", this.config.calendarCount * this.config.oneCalendarWidth + "px")
                          : this.input.css("width", this.config.calendarCount * this.config.oneCalendarWidth + this.config.verticalRangeWidth + "px"))
                    : (!0 === this.config.inline
                          ? ((this.container = this.$elem.wrapAll("<div class='caleran-container-mobile caleran-inline' tabindex='1' onclick=''></div>").parent()),
                            (this.input = a("<div class='caleran-input'></div>").appendTo(this.container)),
                            (this.elem.type = "hidden"),
                            (this.config.showButtons = !1))
                          : ((this.container = a("<div class='caleran-container-mobile' onclick=''></div>").appendTo(this.config.container)),
                            (this.input = a("<div class='caleran-input' style='display: none;'></div>").appendTo(this.container)),
                            this.config.showButtons && (this.config.autoCloseOnSelect = !1),
                            this.config.autoCloseOnSelect || (this.globals.delayInputUpdate = !0)),
                      this.$elem.on("focus", function () {
                          a(this).blur();
                      })),
                this.config.isHotelBooking && this.container.addClass("caleran-hotel-style"),
                this.config.isRTL && (this.container.css("direction", "rtl"), this.container.addClass("caleran-rtl")),
                this.clearRangeSelection();
        },
        clearRangeSelection: function () {
            for (var b = 0; b < this.config.ranges.length; b++) this.config.ranges[b].selected = !1;
            this.container.find(".caleran-range").each(function () {
                a(this).removeClass("caleran-range-selected");
            });
        },
        fetchInputs: function () {
            var b = null;
            if (((b = -1 !== a.inArray(this.config.target.get(0).tagName, this.globals.valElements) ? this.config.target.val() : this.config.target.text()), !1 === this.config.singleDate && b.indexOf(this.config.dateSeparator) > 0)) {
                var c = b.split(this.config.dateSeparator);
                2 == c.length &&
                    moment(c[0], this.config.format, this.config.locale).isValid() &&
                    moment(c[1], this.config.format, this.config.locale).isValid() &&
                    ((this.config.startDate = moment(c[0], this.config.format, this.config.locale).middleOfDay()),
                    (this.config.endDate = moment(c[1], this.config.format, this.config.locale).middleOfDay()),
                    (this.globals.firstValueSelected = !0));
            } else if (!0 === this.config.singleDate) {
                var d = b;
                "" != d &&
                    moment(d, this.config.format, this.config.locale).isValid() &&
                    ((this.config.startDate = moment(d, this.config.format, this.config.locale).middleOfDay()),
                    (this.config.endDate = moment(d, this.config.format, this.config.locale).middleOfDay()),
                    (this.globals.firstValueSelected = !0));
            }
            this.config.startEmpty && !this.globals.firstValueSelected && this.clearInput(), this.validateDates();
        },
        drawUserInterface: function () {
            this.drawHeader(), (this.calendars = this.input.find(".caleran-calendars").first());
            var a = this.globals.currentDate.clone().middleOfDay();
            this.globals.disabledDays = {};
            for (var b = 0; b < this.config.calendarCount; b++) this.drawCalendarOfMonth(a), (a = a.add(1, "month"));
            if (
                (this.calendars.find(".caleran-calendar").last().addClass("no-border-right"),
                this.drawArrows(),
                this.drawFooter(),
                (!0 !== this.globals.isMobile && !1 !== this.config.inline) || !this.globals.initComplete || this.setViewport(),
                !1 === this.globals.startSelected)
            )
                if (this.globals.initComplete) this.updateInput(!1);
                else {
                    var c = this.globals.delayInputUpdate;
                    (this.globals.delayInputUpdate = !1), this.updateInput(!1), (this.globals.delayInputUpdate = c);
                }
            this.reDrawCells();
        },
        drawOverlay: function () {
            0 != this.globals.isMobile &&
                (0 == a(".caleran-overlay").length
                    ? ((this.overlay = a("<div class='caleran-overlay'></div>").appendTo("body")),
                      this.overlay.on("click.caleran tap.caleran", function () {
                          var b = a("body > .caleran-container-mobile");
                          b.length > 0 &&
                              b.each(function () {
                                  "none" != a(this).css("display") && a(this).find(".caleran-cancel").click();
                              });
                      }))
                    : (this.overlay = a(".caleran-overlay").first()));
        },
        drawHeader: function () {
            var a = "<div class='caleran-header'><div class='caleran-header-start'><div class='caleran-header-start-day'></div><div class='caleran-header-start-date'></div><div class='caleran-header-start-weekday'></div></div>";
            !1 === this.config.singleDate &&
                (a +=
                    "<div class='caleran-header-separator'>" +
                    this.config.headerSeparator +
                    "</div><div class='caleran-header-end'><div class='caleran-header-end-day'></div><div class='caleran-header-end-date'></div><div class='caleran-header-end-weekday'></div></div>"),
                (a += "</div><div class='caleran-calendars'></div>"),
                this.input.append(a),
                !1 === this.config.showHeader && this.input.find(".caleran-header").hide(),
                (this.globals.headerStartDay = this.input.find(".caleran-header-start-day")),
                (this.globals.headerStartDate = this.input.find(".caleran-header-start-date")),
                (this.globals.headerStartWeekday = this.input.find(".caleran-header-start-weekday")),
                (this.globals.headerEndDay = this.input.find(".caleran-header-end-day")),
                (this.globals.headerEndDate = this.input.find(".caleran-header-end-date")),
                (this.globals.headerEndWeekday = this.input.find(".caleran-header-end-weekday")),
                this.updateHeader();
        },
        updateHeader: function () {
            this.config.startDate && this.config.startDate.locale(this.config.locale),
                this.config.endDate && this.config.endDate.locale(this.config.locale),
                (this.config.startEmpty && !1 === this.globals.firstValueSelected) ||
                    (null !== this.config.startDate
                        ? (this.globals.headerStartDay.text(this.localizeNumbers(this.config.startDate.date())),
                          this.globals.isMobile
                              ? this.globals.headerStartDate.text(this.config.startDate.format("MMM") + " " + this.localizeNumbers(this.config.startDate.year()))
                              : this.globals.headerStartDate.text(this.config.startDate.format("MMMM") + " " + this.localizeNumbers(this.config.startDate.year())),
                          this.globals.headerStartWeekday.text(this.config.startDate.format("dddd")))
                        : (this.globals.headerStartDay.text(""), this.globals.headerStartDate.text(""), this.globals.headerStartWeekday.text("")),
                    !1 === this.config.singleDate &&
                        (null !== this.config.endDate
                            ? (this.globals.headerEndDay.text(this.localizeNumbers(this.config.endDate.date())),
                              this.globals.isMobile
                                  ? this.globals.headerEndDate.text(this.config.endDate.format("MMM") + " " + this.localizeNumbers(this.config.endDate.year()))
                                  : this.globals.headerEndDate.text(this.config.endDate.format("MMMM") + " " + this.localizeNumbers(this.config.endDate.year())),
                              this.globals.headerEndWeekday.text(this.config.endDate.format("dddd")))
                            : (this.globals.headerEndDay.text(""), this.globals.headerEndDate.text(""), this.globals.headerEndWeekday.text(""))));
        },
        isUpdateable: function () {
            var a = this.globals.delayInputUpdate,
                b = this.config.startEmpty && !this.globals.firstValueSelected;
            return (
                (b = b || (!0 === this.config.singleDate && null === this.config.startDate)), (b = b || (!1 === this.config.singleDate && (null === this.config.startDate || null === this.config.endDate))), b && this.clearInput(), !b && !a
            );
        },
        updateInput: function (b) {
            this.config.startDate && this.config.startDate.locale(this.config.locale),
                this.config.endDate && this.config.endDate.locale(this.config.locale),
                this.isUpdateable() &&
                    (-1 !== a.inArray(this.config.target.get(0).tagName, this.globals.valElements)
                        ? !1 === this.config.singleDate
                            ? this.config.target.val(this.config.startDate.format(this.config.format) + this.config.dateSeparator + this.config.endDate.format(this.config.format))
                            : this.config.target.val(this.config.startDate.format(this.config.format))
                        : !1 === this.config.singleDate
                        ? this.config.target.text(this.config.startDate.format(this.config.format) + this.config.dateSeparator + this.config.endDate.format(this.config.format))
                        : this.config.target.text(this.config.startDate.format(this.config.format)),
                    !0 === this.globals.initComplete && !0 === b && (this.config.onafterselect(this, this.config.startDate.clone(), this.config.endDate.clone()), this.input.trigger("change")));
        },
        clearInput: function (b) {
            if (
                (-1 !== a.inArray(this.config.target.get(0).tagName, this.globals.valElements) ? (this.config.singleDate, this.config.target.val("")) : (this.config.singleDate, this.config.target.text("")),
                (this.config.startDate = null),
                (this.config.endDate = null),
                b ? ((this.config.startEmpty = !0), (this.globals.firstValueSelected = !1)) : 1 == this.config.startEmpty && (this.globals.firstValueSelected = !1),
                this.globals.initComplete)
            ) {
                this.updateHeader();
                var c = void 0 === this.footer ? [] : this.footer.find(".caleran-apply");
                c.length > 0 && c.attr("disabled", "disabled");
            }
        },
        drawArrows: function () {
            var a = this.config.hideOutOfRange && this.config.minDate && this.globals.currentDate.clone().add(-1, "month").isBefore(this.config.minDate, "month"),
                b = this.config.hideOutOfRange && this.config.maxDate && this.globals.currentDate.clone().add(this.config.calendarCount, "month").isAfter(this.config.maxDate, "month");
            this.container.find(".caleran-title").length > 0 &&
                (this.globals.isMobile
                    ? (a || this.container.find(".caleran-title").prepend("<div class='caleran-prev'>" + this.config.prevMonthIcon + "</div>"),
                      b || this.container.find(".caleran-title").append("<div class='caleran-next'>" + this.config.nextMonthIcon + "</div>"))
                    : this.config.isRTL
                    ? (a ||
                          this.container
                              .find(".caleran-title")
                              .last()
                              .prepend("<div class='caleran-prev'>" + this.config.prevMonthIcon + "</div>"),
                      b ||
                          this.container
                              .find(".caleran-title")
                              .first()
                              .append("<div class='caleran-next'>" + this.config.nextMonthIcon + "</div>"))
                    : (a ||
                          this.container
                              .find(".caleran-title")
                              .first()
                              .prepend("<div class='caleran-prev'>" + this.config.prevMonthIcon + "</div>"),
                      b ||
                          this.container
                              .find(".caleran-title")
                              .last()
                              .append("<div class='caleran-next'>" + this.config.nextMonthIcon + "</div>")));
        },
        drawCalendarOfMonth: function (a) {
            var b = moment(a).locale(this.config.locale).startOf("month").startOf("isoweek").middleOfDay(),
                c = b.day();
            1 == c && !1 === this.config.startOnMonday ? (b.add(-1, "days"), (c = 0)) : 0 === c && !0 === this.config.startOnMonday && (b.add(1, "days"), (c = 1)), b.isAfter(moment(a).date(1)) && b.add(-7, "day");
            var d = "<div class='caleran-calendar" + (this.config.showWeekNumbers ? " caleran-calendar-weeknumbers" : "") + "' data-month='" + a.month() + "'>",
                e = 0,
                f = "",
                g = "";
            this.config.enableMonthSwitcher && (f = " class='caleran-month-switch'"),
                this.config.enableYearSwitcher && (g = " class='caleran-year-switch'"),
                (d += "<div class='caleran-title'><b" + f + ">" + a.locale(this.config.locale).format("MMMM") + "</b>&nbsp;<span" + g + ">" + this.localizeNumbers(a.year()) + "</span></div>"),
                (d += "<div class='caleran-days-container'>");
            var h = moment.localeData(this.config.locale).weekdaysShort();
            this.config.showWeekNumbers && (d += "<div class='caleran-dayofweek'>&nbsp;</div>");
            for (var i = c; i < c + 7; i++) d += "<div class='caleran-dayofweek'>" + h[i % 7] + "</div>";
            for (var j = !0, k = null; e < 42; ) {
                var l = b.middleOfDay().unix(),
                    m = a.month() == b.month() ? "caleran-day" : "caleran-disabled";
                e % 7 == 0 && this.config.showWeekNumbers && (d += "<div class='caleran-weeknumber'><span>" + b.format("ww") + "</span></div>"),
                    (d += "<div class='" + m + "' data-value='" + l + "'><span>" + this.localizeNumbers(b.date()) + "</span></div>"),
                    this.isDisabledOnDraw(b) ? ((this.globals.disabledDays[l] = 1 == j ? 2 : 1), (j = !0), (k = l)) : (1 == j && null != k && (this.globals.disabledDays[k] = 3), (j = !1)),
                    b.add(moment.duration({ days: 1 })),
                    e++;
            }
            (d += "</div>"), (d += "</div>"), this.calendars.append(d);
        },
        drawFooter: function () {
            if (!1 === this.config.singleDate && !0 === this.config.showFooter) {
                "horizontal" === this.config.rangeOrientation || this.globals.isMobile
                    ? this.input.append("<div class='caleran-ranges'></div>")
                    : (this.input.addClass("caleran-input-vertical-range"),
                      this.input.wrapInner("<div class='caleran-left'></div>"),
                      a("<div class='caleran-right' style='max-width: " + this.config.verticalRangeWidth + "px; min-width: " + this.config.verticalRangeWidth + "px'><div class='caleran-ranges'></div></div>").insertAfter(
                          this.input.find(".caleran-left")
                      ));
                var b = this.input.parent().find(".caleran-ranges");
                b.append("<span class='caleran-range-header-container'>" + this.config.rangeIcon + "<div class='caleran-range-header'>" + this.config.rangeLabel + "</div></span>");
                for (var c = 0; c < this.config.ranges.length; c++)
                    b.append("<div class='caleran-range" + (this.config.ranges[c].selected ? " caleran-range-selected" : "") + "' data-id='" + c + "'>" + this.config.ranges[c].title + "</div>");
            }
            this.globals.isMobile && !this.config.inline && ((!0 !== this.config.singleDate && !1 !== this.config.showFooter) || this.input.append("<div class='caleran-filler'></div>")),
                ((this.globals.isMobile && !this.config.inline) || (!this.globals.isMobile && !this.config.inline && this.config.showButtons)) &&
                    ("horizontal" === this.config.rangeOrientation || this.globals.isMobile ? this.input.append("<div class='caleran-footer'></div>") : this.input.find(".caleran-right").append("<div class='caleran-footer'></div>"),
                    (this.footer = this.input.find(".caleran-footer")),
                    this.footer.append("<button type='button' class='caleran-cancel'>" + this.config.cancelLabel + "</button>"),
                    this.footer.append("<button type='button' class='caleran-apply'>" + this.config.applyLabel + "</button>"),
                    !1 === this.globals.firstValueSelected && 1 == this.config.startEmpty && this.footer.find(".caleran-apply").attr("disabled", "disabled"),
                    this.globals.isMobile && !1 === this.globals.endSelected && this.footer.find(".caleran-apply").attr("disabled", "disabled"));
        },
        drawNextMonth: function (a) {
            if (((a = a || b.event), 1 == this.config.hideOutOfRange && this.config.maxDate && this.globals.currentDate.clone().add(this.config.calendarCount, "month").isAfter(this.config.maxDate, "month"))) return !1;
            if (null === this.globals.swipeTimeout) {
                var c = this;
                this.globals.swipeTimeout = setTimeout(function () {
                    if (!0 === c.config.onbeforemonthchange(c, c.globals.currentDate.clone().startOfMonth(), "next")) {
                        var a = c.calendars.get(0).scrollTop;
                        c.globals.currentDate.middleOfDay().add(1, "month"), c.reDrawCalendars(), (c.calendars.get(0).scrollTop = a), c.config.onaftermonthchange(c, c.globals.currentDate.clone().startOfMonth());
                    }
                    c.globals.swipeTimeout = null;
                }, 100);
            }
            this.stopBubbling(a);
        },
        drawPrevMonth: function (a) {
            if (((a = a || b.event), 1 == this.config.hideOutOfRange && this.config.minDate && this.globals.currentDate.clone().add(-1, "month").isBefore(this.config.minDate, "month"))) return !1;
            if (null === this.globals.swipeTimeout) {
                var c = this;
                this.globals.swipeTimeout = setTimeout(function () {
                    if (!0 === c.config.onbeforemonthchange(c, c.globals.currentDate.clone().startOfMonth(), "prev")) {
                        var a = c.calendars.get(0).scrollTop;
                        c.globals.currentDate.middleOfDay().subtract(1, "month"), c.reDrawCalendars(), (c.calendars.get(0).scrollTop = a), c.config.onaftermonthchange(c, c.globals.currentDate.clone().startOfMonth());
                    }
                    c.globals.swipeTimeout = null;
                }, 100);
            }
            this.stopBubbling(a);
        },
        cellClicked: function (c) {
            (c = c || b.event), (c.target = c.target || c.srcElement), !1 === a(c.target).hasClass("caleran-day") && (c.target = a(c.target).closest(".caleran-day").get(0));
            var d = a(c.target).data("value"),
                e = moment.unix(d).middleOfDay();
            if (0 == this.config.validateClick(e)) return !1;
            if (!1 === this.config.singleDate)
                if (!1 === this.globals.startSelected) {
                    null !== this.config.startDate && (this.globals.startDateBackup = this.config.startDate.clone()),
                        (this.config.startDate = e),
                        (this.config.endDate = null),
                        (this.globals.startSelected = !0),
                        (this.globals.endSelected = !1);
                    var f = void 0 === this.footer ? [] : this.footer.find(".caleran-apply");
                    f.length > 0 && f.attr("disabled", "disabled"), this.config.onfirstselect(this, this.config.startDate.clone());
                } else {
                    if (e.isBefore(this.config.startDate)) {
                        var g = this.config.startDate.clone();
                        (this.config.startDate = e.clone()), (e = g);
                    }
                    e.diff(this.config.startDate, "day") < this.config.minSelectedDays
                        ? ((this.globals.startSelected = !1), this.fetchInputs())
                        : ((this.globals.startDateBackup = null),
                          (this.config.endDate = e),
                          (this.globals.endSelected = !0),
                          (this.globals.startSelected = !1),
                          (this.globals.hoverDate = null),
                          !0 === this.config.onbeforeselect(this, this.config.startDate.clone(), this.config.endDate.clone()) && !0 === this.checkRangeContinuity()
                              ? ((this.globals.firstValueSelected = !0), this.clearRangeSelection(), this.updateInput(!0))
                              : this.fetchInputs(),
                          this.config.autoCloseOnSelect && !1 === this.config.inline ? this.hideDropdown(c) : void 0 !== this.footer && null != this.config.endDate && this.footer.find(".caleran-apply").removeAttr("disabled"));
                }
            else
                (this.config.startDate = e),
                    (this.config.endDate = e),
                    (this.globals.endSelected = !0),
                    (this.globals.startSelected = !1),
                    (this.globals.hoverDate = null),
                    !0 === this.config.onbeforeselect(this, this.config.startDate.clone(), this.config.endDate.clone()) ? ((this.globals.firstValueSelected = !0), this.clearRangeSelection(), this.updateInput(!0)) : this.fetchInputs(),
                    this.config.autoCloseOnSelect && !1 === this.config.inline ? this.hideDropdown(c) : void 0 !== this.footer && null != this.config.endDate && this.footer.find(".caleran-apply").removeAttr("disabled");
            return this.reDrawCells(), this.updateHeader(), this.stopBubbling(c), !1;
        },
        checkRangeContinuity: function () {
            var a = this.config.endDate.diff(this.config.startDate, "days"),
                b = moment(this.config.startDate).middleOfDay();
            if (1 == this.config.disableOnlyStart) return !1 === this.isDisabled(this.config.startDate, this.config.isHotelBooking);
            if (1 == this.config.disableOnlyEnd) return !1 === this.isDisabled(this.config.endDate, this.config.isHotelBooking);
            if (this.config.continuous) {
                var c = b.middleOfDay().unix();
                if (1 == this.isDisabled(c, !1) && (!this.config.isHotelBooking || 1 === this.getDisabledLevel(c))) return !1;
                if (0 == b.isSame(this.config.endDate, "day")) {
                    b.middleOfDay().add(1, "days");
                    for (var e = 0; e <= a - 2; e++) {
                        if (((c = b.middleOfDay().unix()), this.getDisabledLevel(c) !== d)) return !1;
                        b.add(1, "days");
                    }
                }
                if (((c = b.middleOfDay().unix()), 1 == this.isDisabled(c, !1) && (!this.config.isHotelBooking || 3 === this.getDisabledLevel(c)))) return !1;
            }
            return !0;
        },
        isDisabledOnDraw: function (a) {
            var b = moment(a).middleOfDay();
            if (!0 === this.config.disableDays(b)) return !0;
            for (var c = 0; c < this.config.disabledRanges.length; c++) {
                var d = this.config.disabledRanges[c];
                if (b.isBetween(d.start, d.end, "day", "[]")) return !0;
            }
        },
        isDisabled: function (a, b) {
            return (
                d === b && (b = !1),
                (1 != this.config.disableOnlyStart || 1 != this.globals.startSelected) &&
                    (1 != this.config.disableOnlyEnd || 0 != this.globals.startSelected) &&
                    ("object" == typeof a && null !== a && (a = a.middleOfDay().unix()), b && this.config.isHotelBooking ? 2 === this.globals.disabledDays[a] : this.globals.disabledDays[a] !== d)
            );
        },
        getDisabledLevel: function (a) {
            return "object" == typeof a && null !== a && (a = a.middleOfDay().unix()), this.globals.disabledDays[a];
        },
        cellHovered: function (c) {
            (c = c || b.event), (c.target = c.target || c.srcElement), !1 === a(c.target).hasClass("caleran-day") && (c.target = a(c.target).closest(".caleran-day").get(0));
            var d = a(c.target).data("value");
            (this.globals.hoverDate = moment.unix(d).middleOfDay()), (this.globals.keyboardHoverDate = null), !0 === this.globals.startSelected && this.reDrawCells(), this.stopBubbling(c);
        },
        reDrawCalendars: function () {
            this.input.empty(), this.drawUserInterface(), this.container.focus();
        },
        monthSwitchClicked: function () {
            if (!(this.calendars.find(".caleran-month-selector").length > 0)) {
                var b = this;
                this.calendars.get(0).scrollTop = 0;
                for (var c = a("<div class='caleran-month-selector'></div>").appendTo(this.calendars), d = this.globals.currentDate.get("month"), e = this.globals.currentDate.clone(), f = 0; f < 12; f++)
                    e.month(f),
                        this.config.hideOutOfRange && (e.isBefore(this.config.minDate, "month") || e.isAfter(this.config.maxDate, "month"))
                            ? c.append("<div class='caleran-ms-month-disabled'>&nbsp;</div>")
                            : c.append(
                                  "<div class='caleran-ms-month" +
                                      (d == f ? " current" : "") +
                                      "' data-month='" +
                                      f +
                                      "'>" +
                                      (this.config.numericMonthSelector ? f + 1 : moment({ day: 15, hour: 12, month: f }).locale(this.config.locale).format(this.config.monthSwitcherFormat)) +
                                      "</div>"
                              );
                c.css("display", "block"),
                    this.optimizeFontSize(c.find(".caleran-ms-month")),
                    c
                        .find(".caleran-ms-month")
                        .off("click")
                        .on("click", function (c) {
                            b.globals.currentDate.month(a(this).data("month")),
                                b.config.onaftermonthchange(b, b.globals.currentDate.clone().startOfMonth()),
                                b.reDrawCalendars(),
                                b.calendars.find(".caleran-month-selector").remove(),
                                b.stopBubbling(c);
                        });
            }
        },
        drawYearSwitch: function (a, b) {
            a.data("year", b), a.empty();
            var c = b - 6,
                d = b + 6;
            this.config.hideOutOfRange && (moment(c + "-01-01").isBefore(this.config.minDate, "year") || moment(c + "-12-31").isAfter(this.config.maxDate, "year"))
                ? a.append("<div class='caleran-ys-year-disabled'>&nbsp;</div>")
                : a.append("<div class='caleran-ys-year-prev'><i class='fa fa-angle-double-left'></i></div>");
            for (var e = b - 6; e < b + 7; e++)
                this.config.hideOutOfRange && (moment(e + "-06-01").isBefore(this.config.minDate, "year") || moment(e + "-06-01").isAfter(this.config.maxDate, "year"))
                    ? a.append("<div class='caleran-ys-year-disabled'>&nbsp;</div>")
                    : a.append("<div class='caleran-ys-year" + (b == e ? " current" : "") + "' data-year='" + e + "'>" + this.localizeNumbers(e) + "</div>");
            this.config.hideOutOfRange && (moment(d + "-01-01").isBefore(this.config.minDate, "year") || moment(d + "-12-31").isAfter(this.config.maxDate, "year"))
                ? a.append("<div class='caleran-ys-year-disabled'>&nbsp;</div>")
                : a.append("<div class='caleran-ys-year-next'><i class='fa fa-angle-double-right'></i></div>");
        },
        yearSwitchClicked: function () {
            if (!(this.calendars.find(".caleran-year-selector").length > 0)) {
                var b = this;
                this.calendars.get(0).scrollTop = 0;
                var d = a("<div class='caleran-year-selector'></div>").appendTo(this.calendars),
                    e = this.globals.currentDate.get("year");
                this.drawYearSwitch(d, e),
                    d.css("display", "block"),
                    this.optimizeFontSize(d.find(".caleran-ys-year")),
                    a(c)
                        .off("click.caleranys")
                        .on("click.caleranys", ".caleran-ys-year", function (c) {
                            b.globals.currentDate.year(a(this).data("year")),
                                b.config.onafteryearchange(b, b.globals.currentDate.clone().startOf("year")),
                                b.reDrawCalendars(),
                                b.calendars.find(".caleran-year-selector").remove(),
                                1 == b.config.DOBCalendar && b.calendars.find(".caleran-calendar").first().find(".caleran-month-switch").click(),
                                b.stopBubbling(c);
                        }),
                    a(c)
                        .off("click.caleranysprev")
                        .on("click.caleranysprev", ".caleran-ys-year-prev", function (a) {
                            var c = d.data("year") - 13;
                            d.data("year", c), b.drawYearSwitch(d, c), b.stopBubbling(a);
                        }),
                    a(c)
                        .off("click.caleranysnext")
                        .on("click.caleranysnext", ".caleran-ys-year-next", function (a) {
                            var c = d.data("year") + 13;
                            d.data("year", c), b.drawYearSwitch(d, c), b.stopBubbling(a);
                        });
            }
        },
        optimizeFontSize: function (c) {
            c.each(function (c, d) {
                (d = a(d)), d.wrapInner("<span class='adjust-subject'></span>").prepend("<span class='font-adjuster'>i</span>");
                var e = d.find(".adjust-subject"),
                    f = d.find(".font-adjuster");
                if (e.innerHeight() === f.innerHeight()) f.remove(), e.contents().unwrap();
                else {
                    for (var g = 0; e.innerHeight() !== f.innerHeight() && g < 16; ) {
                        var h = 0;
                        if (
                            ((h = void 0 !== b.getComputedStyle ? parseFloat(b.getComputedStyle(f.get(0), null).getPropertyValue("font-size")) : parseFloat(f.css("font-size"))),
                            e.parent().css("font-size", h - 1 + "px"),
                            f.css("font-size", h - 1 + "px"),
                            h < 2)
                        )
                            break;
                        g++;
                    }
                    f.remove(), e.contents().unwrap();
                }
            });
        },
        showDropdown: function (c) {
            var d = c || b.event || jQuery.Event("click", { target: this.elem }),
                e = d.target || d.srcElement;
            ((!this.globals.isMobile && "none" == this.container.css("display")) || (this.globals.isMobile && "none" == this.input.css("display"))) &&
                (e !== this.elem && ((this.globals.dontHideOnce = !0), (this.globals.initiator = e)),
                this.fetchInputs(),
                this.reDrawCalendars(),
                (this.globals.startDateInitial = this.config.startDate),
                (this.globals.endDateInitial = this.config.endDate),
                this.config.onbeforeshow(this),
                this.globals.isMobile ? (this.input.css({ display: "flex" }), this.overlay.show(), a("body").addClass("caleran-open")) : this.container.css({ display: "block" }),
                this.setViewport(),
                1 == this.config.DOBCalendar && this.calendars.find(".caleran-calendar").first().find(".caleran-year-switch").click(),
                this.config.onaftershow(this));
        },
        hideDropdown: function (c) {
            var d = c || b.event || jQuery.Event("click", { target: "body" }),
                e = d.target || d.srcElement;
            this.globals.initiator !== e &&
                !1 === this.config.inline &&
                ((!this.globals.isMobile && "none" !== this.container.css("display")) || (this.globals.isMobile && "none" !== this.input.css("display"))) &&
                (this.config.onbeforehide(this),
                this.globals.isMobile ? (this.input.css({ display: "none" }), this.overlay.hide(), a("body").removeClass("caleran-open")) : this.container.css({ display: "none" }),
                (this.globals.hoverDate = null),
                null !== this.globals.startDateBackup && ((this.config.startDate = this.globals.startDateBackup), (this.globals.startSelected = !1)),
                this.config.onafterhide(this));
        },
        reDrawCells: function () {
            var b = this,
                c = null != this.config.startDate ? this.config.startDate.middleOfDay().unix() : null,
                d = null != this.config.endDate ? this.config.endDate.middleOfDay().unix() : null,
                e = null != this.config.minDate ? this.config.minDate.middleOfDay().unix() : null,
                f = null != this.config.maxDate ? this.config.maxDate.middleOfDay().unix() : null,
                g = null != this.globals.hoverDate ? this.globals.hoverDate.middleOfDay().unix() : null,
                h = null != this.globals.keyboardHoverDate ? this.globals.keyboardHoverDate.middleOfDay().unix() : null,
                i = moment().middleOfDay().unix();
            this.lastHoverStatus = !1;
            for (var j = 0; j < this.config.calendarCount; j++)
                for (var k = this.calendars.find(".caleran-calendar").eq(j), l = k.find(".caleran-days-container > div").not(".caleran-dayofweek, .caleran-weeknumber"), m = k.data("month"), n = 0; n < l.length; n++) {
                    var o = a(l[n]),
                        p = parseInt(o.attr("data-value")),
                        q = moment.unix(p).middleOfDay().locale(b.config.locale),
                        r = "caleran-day",
                        s = q.day();
                    (6 != s && 0 !== s) || (r += " caleran-weekend"),
                        p === i && (r += " caleran-today"),
                        (r = this.addDisabledStyles(o, q, p, r, e, f, m)),
                        (r = this.addSelectedStyles(p, r, c, d, e, f)),
                        (r = this.addHoverStyles(o, p, r, this, c, g, h)),
                        o.attr("class", r);
                }
            this.attachEvents(), this.config.ondraw(this);
        },
        addSelectedStyles: function (a, b, c, d, e, f) {
            var g = this;
            return (
                (!1 === g.config.startEmpty || g.globals.firstValueSelected) &&
                    (!1 === g.config.singleDate && null !== c && c === a && (b += " caleran-start"),
                    !1 === g.config.singleDate && null !== d && d === a && (b += " caleran-end"),
                    !1 === g.config.singleDate && null !== c && null !== d && a <= d && a >= c && (b += " caleran-selected"),
                    !0 === g.config.singleDate && null !== c && c === a && (b += " caleran-selected caleran-start caleran-end")),
                b
            );
        },
        addHoverStyles: function (a, b, c, d, e, f, g) {
            var h = this;
            return (
                c.replace("caleran-hovered", "").replace("caleran-hovered-last", "").replace("caleran-hovered-first", ""),
                !0 === h.globals.startSelected && !1 === h.globals.endSelected && null !== f && ((b >= f && b <= e) || (b <= f && b >= e)) && (c += " caleran-hovered"),
                1 == h.config.enableKeyboard && null !== g && (!1 === h.globals.startSelected ? g == b && (c += " caleran-hovered") : ((b <= e && b >= g) || (b >= e && b <= g)) && (c += " caleran-hovered")),
                !1 === this.lastHoverStatus && c.indexOf("caleran-hovered") > 0 && ((this.lastHoverStatus = !0), (c += " caleran-hovered-first")),
                !0 === this.lastHoverStatus && c.indexOf("caleran-hovered") < 0 && (a.prev(".caleran-day").addClass("caleran-hovered-last"), (this.lastHoverStatus = !1)),
                c
            );
        },
        addDisabledStyles: function (a, b, c, d, e, f, g) {
            if (this.isDisabled(c))
                if (0 == this.config.isHotelBooking) d = d.replace("caleran-day", "caleran-disabled caleran-disabled-range");
                else
                    switch (this.globals.disabledDays[c]) {
                        case 1:
                            d = d.replace("caleran-day", "caleran-day caleran-disabled-range caleran-disabled-range-start");
                            break;
                        case 2:
                            d = d.replace("caleran-day", "caleran-disabled caleran-disabled-range");
                            break;
                        case 3:
                            d = d.replace("caleran-day", "caleran-day caleran-disabled-range caleran-disabled-range-end");
                    }
            else ((null != f && c > f) || (null != e && c < e)) && (d = d = d.replace("caleran-day", "caleran-disabled"));
            return b.month() != g && (d += " caleran-not-in-month"), d;
        },
        localizeNumbers: function (a) {
            return moment.localeData(this.config.locale).postformat("" + a);
        },
        rangeClicked: function (c) {
            if (((c = c || b.event), (c.target = c.target || c.srcElement), c.target.hasAttribute("data-id"))) {
                var d = a(c.target).attr("data-id");
                return (
                    (this.globals.currentDate = this.config.ranges[d].startDate.startOf("day").clone().middleOfDay()),
                    (this.config.startDate = this.config.ranges[d].startDate.startOf("day").clone().middleOfDay()),
                    (this.config.endDate = this.config.ranges[d].endDate.startOf("day").clone().middleOfDay()),
                    (this.globals.firstValueSelected = !0),
                    !1 === this.checkRangeContinuity()
                        ? this.fetchInputs()
                        : (this.clearRangeSelection(),
                          (this.config.ranges[d].selected = !0),
                          this.config.onrangeselect(this, this.config.ranges[d]),
                          this.reDrawCalendars(),
                          this.setViewport(),
                          this.config.autoCloseOnSelect && this.hideDropdown()),
                    this.stopBubbling(c),
                    !1
                );
            }
        },
        setViewport: function () {
            if (!0 === this.globals.isMobile) "none" !== this.input.css("display") && this.container.trigger("caleran:resize");
            else if ("none" !== this.container.css("display") && this.globals.initComplete && !1 === this.globals.isMobile && !1 === this.config.inline) {
                var a = this.getViewport();
                switch (this.config.showOn) {
                    case "top":
                        this.config.autoAlign ? this.positionOnTopAlign(a) : this.positionOnTop(!1, a), this.horizontalAlign(a);
                        break;
                    case "left":
                        this.config.autoAlign ? this.positionOnLeftAlign(a) : this.positionOnLeft(!1, a), this.verticalAlign(a);
                        break;
                    case "right":
                        this.config.autoAlign ? this.positionOnRightAlign(a) : this.positionOnRight(!1, a), this.verticalAlign(a);
                        break;
                    case "bottom":
                        this.config.autoAlign ? this.positionOnBottomAlign(a) : this.positionOnBottom(!1, a), this.horizontalAlign(a);
                        break;
                    case "center":
                        this.positionOnCenter(a);
                        break;
                    default:
                        this.config.autoAlign ? this.positionOnBottomAlign(a) : this.positionOnBottom(!1, a), this.horizontalAlign(a);
                }
                if ("horizontal" !== this.config.rangeOrientation) {
                    var b = this.input.find(".caleran-header").outerHeight() + this.input.find(".caleran-calendars").outerHeight() + (this.input.find(".caleran-footer").length > 0 ? this.input.find(".caleran-footer").outerHeight() : 0);
                    this.input.find(".caleran-right").css("max-height", b);
                }
            }
        },
        verticalAlign: function (b) {
            var c = this.getDimensions(this.container, !0),
                d = b.top - c.offsetTop,
                e = c.offsetTop + c.height - b.bottom;
            d > 0 && Math.abs(d) < c.height
                ? (this.container.css({
                      top: function () {
                          return parseFloat(a(this).css("top").replace(/px$/, "")) + d;
                      },
                  }),
                  this.container.find("div[class*='caleran-box-arrow-']").css({
                      top: function () {
                          return parseFloat(a(this).css("top").replace(/px$/, "")) - d;
                      },
                  }))
                : e > 0 &&
                  Math.abs(e) < c.height &&
                  (this.container.css({
                      top: function () {
                          return parseFloat(a(this).css("top").replace(/px$/, "")) - e;
                      },
                  }),
                  this.container.find("div[class*='caleran-box-arrow-']").css({
                      top: function () {
                          return parseFloat(a(this).css("top").replace(/px$/, "")) + e;
                      },
                  }));
        },
        horizontalAlign: function (b) {
            var c = this.getDimensions(this.container, !0),
                d = c.offsetLeft + c.width - b.right;
            d > 0 &&
                Math.abs(d) < c.width &&
                (this.container.css({
                    left: function () {
                        return parseFloat(a(this).css("left").replace(/px$/, "")) - d;
                    },
                }),
                this.container.find("div[class*='caleran-box-arrow-']").css({
                    left: function () {
                        return parseFloat(a(this).css("left").replace(/px$/, "")) + d;
                    },
                }));
        },
        getDropdownPos: function (a) {
            var b = this.getDimensions(this.$elem, !0),
                c = this.getDimensions(this.container, !0),
                d = parseInt(this.input.css("margin-left"), 10),
                e = parseFloat(this.container.find("div[class*='caleran-box-arrow']").first().outerHeight() / 2);
            switch (a) {
                case "left":
                    switch (this.config.arrowOn) {
                        case "top":
                            return { top: b.offsetTop - d - e - b.height / 2, left: b.offsetLeft - c.width - d, arrow: 0 };
                        case "center":
                            return { top: b.offsetTop - d - c.height / 2, left: b.offsetLeft - c.width - d, arrow: (c.height - 2 * e) / 2 - b.height / 2 };
                        case "bottom":
                            return { top: b.offsetTop - c.height + b.height + 2 * d + e, left: b.offsetLeft - c.width - d, arrow: c.height - 4 * e - 3 * d - b.height / 2 };
                        default:
                            return { top: b.offsetTop - d - e - b.height / 2, left: b.offsetLeft - c.width - d, arrow: 0 };
                    }
                    break;
                case "right":
                    switch (this.config.arrowOn) {
                        case "top":
                            return { top: b.offsetTop - d - e - b.height / 2, left: b.offsetLeft + b.width + d, arrow: 0 };
                        case "center":
                            return { top: b.offsetTop - d - c.height / 2, left: b.offsetLeft + b.width + d, arrow: (c.height - 2 * e) / 2 - b.height / 2 };
                        case "bottom":
                            return { top: b.offsetTop - c.height + b.height + 2 * d + e, left: b.offsetLeft + b.width + d, arrow: c.height - 4 * e - 3 * d - b.height / 2 };
                        default:
                            return { top: b.offsetTop - d - e - b.height / 2, left: b.offsetLeft + b.width + d, arrow: 0 };
                    }
                    break;
                case "top":
                    switch (this.config.arrowOn) {
                        case "left":
                            return { top: b.offsetTop - c.height - d, left: b.offsetLeft - d, arrow: 0 };
                        case "center":
                            return { top: b.offsetTop - c.height - d, left: b.offsetLeft - (c.width - 2 * d - b.width) / 2, arrow: (c.width - 5 * e) / 2 };
                        case "right":
                            return { top: b.offsetTop - c.height - d, left: b.offsetLeft - (c.width - b.width) + d, arrow: c.width - 5 * e + d };
                        default:
                            return { top: b.offsetTop - c.height - d, left: b.offsetLeft - d, arrow: 0 };
                    }
                    break;
                case "bottom":
                    switch (this.config.arrowOn) {
                        case "left":
                            return { top: b.offsetTop + b.height - d + e, left: b.offsetLeft - d, arrow: 0 };
                        case "center":
                            return { top: b.offsetTop + b.height - d + e, left: b.offsetLeft - (c.width - 2 * d - b.width) / 2, arrow: (c.width - 5 * e) / 2 };
                        case "right":
                            return { top: b.offsetTop + b.height - d + e, left: b.offsetLeft - (c.width - b.width) + d, arrow: c.width - 5 * e + d };
                        default:
                            return { top: b.offsetTop + b.height - d + e, left: b.offsetLeft - d, arrow: 0 };
                    }
                    break;
                case "center":
                    switch (this.config.arrowOn) {
                        case "center":
                            return { top: b.offsetTop - d - c.height / 2, left: b.offsetLeft - (c.width - 2 * d - b.width) / 2 };
                    }
            }
        },
        positionOnTop: function (a, b) {
            var c = this.getDropdownPos("top");
            if (a) return c;
            this.container.css({ left: c.left, top: c.top }), this.container.removeClass('position-top position-bottom'), this.container.addClass('position-bottom').find("div[class*='caleran-box-arrow-']").attr("class", "caleran-box-arrow-bottom").css({ left: c.arrow });
        },
        positionOnBottom: function (a, b) {
            var c = this.getDropdownPos("bottom");
            if (a) return c;
            this.container.css({ left: c.left, top: c.top }), this.container.removeClass('position-top position-bottom'), this.container.addClass('position-top').find("div[class*='caleran-box-arrow-']").attr("class", "caleran-box-arrow-top").css({ left: c.arrow });
        },
        positionOnLeft: function (a, b) {
            var c = this.getDropdownPos("left");
            if (a) return c;
            this.container.css({ left: c.left, top: c.top }), this.container.children("div[class*='caleran-box-arrow-']").attr("class", "caleran-box-arrow-right").css({ top: c.arrow });
        },
        positionOnRight: function (a, b) {
            var c = this.getDropdownPos("right");
            if (a) return c;
            this.container.css({ left: c.left, top: c.top }), this.container.children("div[class*='caleran-box-arrow-']").attr("class", "caleran-box-arrow-left").css({ top: c.arrow });
        },
        positionOnCenter: function (a) {
            var b = this.getDropdownPos("center"),
                c = Math.max(b.left + this.container[0].clientWidth - (a.right - 30), 0),
                d = Math.max(b.top + this.container[0].clientHeight - (a.bottom - 30), 0);
            this.config.autoAlign || ((c = 0), (d = 0)), (b.left -= c), (b.top -= d), this.container.css({ left: b.left, top: b.top }), this.container.find("div[class*='caleran-box-arrow-']").remove();
        },
        positionOnBottomAlign: function (a) {
            var b = this.positionOnBottom(!0, a),
                c = this.getDimensions(this.container);
            b.top + c.height < a.bottom ? this.positionOnBottom(!1, a) : this.positionOnTop(!1, a);
        },
        positionOnLeftAlign: function (a) {
            this.positionOnLeft(!0, a).left > a.left - 50 ? this.positionOnLeft(!1, a) : this.positionOnRight(!1, a);
        },
        positionOnRightAlign: function (a) {
            var b = this.positionOnRight(!0, a),
                c = this.getDimensions(this.container);
            b.left + c.width < a.right + 50 ? this.positionOnRight(!1, a) : this.positionOnLeft(!1, a);
        },
        positionOnTopAlign: function (a) {
            this.positionOnTop(!0, a).top > a.top ? this.positionOnTop(!1, a) : this.positionOnBottom(!1, a);
        },
        getDimensions: function (b, d) {
            var e = c,
                f = e.body,
                g = b[0],
                h = b.offset();
            if (b === this.$elem && 0 == this.globals.parentScrollEventsAttached) {
                var i = a.proxy(function () {
                    this.globals.isTicking ||
                        ((this.globals.isTicking = !0),
                        (this.globals.rafID = this.requestAnimFrame(
                            a.proxy(function () {
                                this.setViewport(), this.cancelAnimFrame(this.globals.rafID), (this.globals.isTicking = !1);
                            }, this)
                        )));
                }, this);
                if (g !== f) for (var j = g.parentNode; j !== f && null !== j; ) j.scrollHeight > j.offsetHeight && a(j).off("scroll.caleran").on("scroll.caleran", i), (j = j.parentNode);
                this.globals.parentScrollEventsAttached = !0;
            }
            return { width: g.offsetWidth, height: g.offsetHeight, offsetLeft: h.left, offsetTop: h.top };
        },
        getViewport: function () {
            var a = this.globals.lastScrollY,
                c = this.globals.lastScrollX,
                d = a + b.innerHeight;
            return { top: a, left: c, right: c + b.innerWidth, bottom: d };
        },
        attachEvents: function () {
            var b = a.proxy(this.drawNextMonth, this),
                c = a.proxy(this.drawPrevMonth, this),
                d = a.proxy(this.cellClicked, this),
                e = a.proxy(this.cellHovered, this),
                f = a.proxy(this.rangeClicked, this),
                g = a.proxy(this.monthSwitchClicked, this),
                h = a.proxy(this.yearSwitchClicked, this),
                i = "click.caleran";
            if (
                (this.container
                    .find(".caleran-next")
                    .off(i)
                    .one(i, this.config.isRTL ? c : b),
                this.container
                    .find(".caleran-prev")
                    .off(i)
                    .one(i, this.config.isRTL ? b : c),
                this.container.find(".caleran-day").off(i).on(i, d),
                this.container.find(".caleran-day").off("mouseover.caleran").on("mouseover.caleran", e),
                this.container.find(".caleran-disabled").not(".caleran-day").off(i),
                this.container.find(".caleran-range").off(i).on(i, f),
                this.container.find(".caleran-month-switch ").off(i).on(i, g),
                this.container.find(".caleran-year-switch ").off(i).on(i, h),
                !0 === this.globals.isMobile && 1 == this.config.enableSwipe)
            )
                if ("function" == typeof a.fn.swiperight)
                    this.input.find(".caleran-calendars").css("touch-action", "none"),
                        this.input.find(".caleran-calendars").on("swipeleft", this.config.isRTL ? b : c),
                        this.input.find(".caleran-calendars").on("swiperight", this.config.isRTL ? c : b);
                else {
                    var j = new Hammer(this.input.find(".caleran-calendars").get(0));
                    j.off("swipeleft").on("swipeleft", this.config.isRTL ? b : c), j.off("swiperight").on("swiperight", this.config.isRTL ? c : b);
                }
            (!this.globals.isMobile && !this.config.showButtons) ||
                this.config.inline ||
                (this.input
                    .find(".caleran-cancel")
                    .off("click.caleran")
                    .on(
                        "click.caleran",
                        a.proxy(function (a) {
                            1 == this.config.onCancel(this, this.config.startDate, this.config.endDate) &&
                                (this.globals.startDateInitial && (this.config.startDate = this.globals.startDateInitial.clone()),
                                this.globals.endDateInitial && (this.config.endDate = this.globals.endDateInitial.clone()),
                                this.hideDropdown(a));
                        }, this)
                    ),
                this.input
                    .find(".caleran-apply")
                    .off("click.caleran")
                    .on(
                        "click.caleran",
                        a.proxy(function (a) {
                            !0 === this.config.onbeforeselect(this, this.config.startDate.clone(), this.config.endDate.clone()) && !0 === this.checkRangeContinuity()
                                ? ((this.globals.firstValueSelected = !0), this.globals.delayInputUpdate ? ((this.globals.delayInputUpdate = !1), this.updateInput(!0), (this.globals.delayInputUpdate = !0)) : this.updateInput(!0))
                                : this.fetchInputs(),
                                this.hideDropdown(a);
                        }, this)
                    ));
        },
        addInitialEvents: function () {
            var d = this,
                e = "click.caleran";
            (this.globals.documentEvent = e + "_" + Math.round(new Date().getTime() + 100 * Math.random())),
                a(c).on(
                    this.globals.documentEvent,
                    a.proxy(function (c) {
                        if (!1 === this.globals.isMobile && !1 === this.config.inline) {
                            var d = c || b.event || jQuery.Event("click", { target: "body" }),
                                e = d.target || d.srcElement;
                            0 === a(this.container).find(a(e)).length && this.elem !== e && this.container.is(":visible") > 0 && this.hideDropdown(d);
                        }
                    }, this)
                ),
                this.config.enableKeyboard && (e = "click.caleran focus.caleran"),
                this.$elem.off(e).on(
                    e,
                    a.proxy(
                        this.debounce(
                            function (d) {
                                var e = d || b.event || jQuery.Event("click", { target: "body" }),
                                    f = e.target || e.srcElement;
                                this.input.get(0).clientHeight > 0 && this.config.target.get(0) !== f ? this.hideDropdown(e) : (a(c).trigger("click"), this.showDropdown(e));
                            },
                            200,
                            !0
                        ),
                        this
                    )
                ),
                this.globals.isMobile &&
                    a(b).on(
                        "resize.caleran",
                        a.proxy(function () {
                            this.container.trigger("caleran:resize");
                        }, this)
                    ),
                this.container.on("caleran:resize", function () {
                    d.globals.rafID = d.requestAnimFrame(function () {
                        if ("none" !== d.input.css("display")) {
                            var a = d.input.find(".caleran-calendar:visible:first").innerHeight();
                            d.input.find(".caleran-calendars").css("height", a),
                                d.input.position().top < 0 && d.input.addClass("caleran-input-top-reset"),
                                b.innerWidth > b.innerHeight ? d.input.css("height", a + "px") : d.input.css("height", "auto"),
                                d.cancelAnimFrame(d.globals.rafID);
                        }
                    });
                }),
                "none" !== this.input.css("display") && this.globals.isMobile && this.container.trigger("caleran:resize"),
                !1 === this.globals.isMobile &&
                    a(b).on("resize.caleran scroll.caleran", function () {
                        d.globals.isTicking ||
                            ((d.globals.isTicking = !0),
                            (d.globals.lastScrollX = b.scrollX || b.pageXOffset || c.documentElement.scrollLeft),
                            (d.globals.lastScrollY = b.scrollY || b.pageYOffset || c.documentElement.scrollTop),
                            (d.globals.rafID = d.requestAnimFrame(
                                a.proxy(function () {
                                    this.setViewport(), (this.globals.isTicking = !1), this.cancelAnimFrame(this.globals.rafID);
                                }, d)
                            )));
                    });
        },
        stopBubbling: function (a) {
            void 0 !== a.stopPropagation ? a.stopPropagation() : void 0 !== a.cancelBubble && (a.cancelBubble = !0), void 0 !== a.preventDefault && a.preventDefault(), (a.returnValue = !1);
        },
        debounce: function (a, b, c) {
            return function () {
                var d = this,
                    e = arguments,
                    f = function () {
                        (d.globals.throttleTimeout = null), c || a.apply(d, e);
                    },
                    g = c && !d.globals.throttleTimeout;
                clearTimeout(d.globals.throttleTimeout), (d.globals.throttleTimeout = setTimeout(f, b)), g && a.apply(d, e);
            };
        },
        requestAnimFrame: function (a) {
            return "function" == typeof b.requestAnimationFrame
                ? requestAnimationFrame(a)
                : "function" == typeof b.webkitRequestAnimationFrame
                ? webkitRequestAnimationFrame(a)
                : "function" == typeof b.mozRequestAnimationFrame
                ? mozRequestAnimationFrame(a)
                : setTimeout(a, 100 / 6);
        },
        cancelAnimFrame: function (a) {
            return "function" == typeof b.cancelAnimationFrame
                ? cancelAnimationFrame(a)
                : "function" == typeof b.webkitCancelAnimationFrame
                ? webkitCancelAnimationFrame(a)
                : "function" == typeof b.mozCancelAnimationFrame
                ? mozCancelAnimationFrame(a)
                : clearTimeout(a);
        },
        addKeyboardEvents: function () {
            if (this.config.enableKeyboard) {
                var b = a.proxy(function (a) {
                    var b = a.which ? a.which : a.keyCode;
                    null === this.globals.keyboardHoverDate
                        ? null === this.config.startDate
                            ? (this.globals.keyboardHoverDate = moment({ day: 1, month: this.calendars.first().data("month") }).middleOfDay())
                            : (this.globals.keyboardHoverDate = this.config.startDate.clone().middleOfDay())
                        : this.globals.keyboardHoverDate.middleOfDay();
                    var c = !1,
                        d = !1;
                    switch (b) {
                        case 37:
                            this.globals.keyboardHoverDate.add(-1, "day"), (c = !0), (d = !0);
                            break;
                        case 38:
                            this.globals.keyboardHoverDate.add(-1, "week"), (c = !0), (d = !0);
                            break;
                        case 39:
                            this.globals.keyboardHoverDate.add(1, "day"), (c = !0), (d = !0);
                            break;
                        case 40:
                            this.globals.keyboardHoverDate.add(1, "week"), (c = !0), (d = !0);
                            break;
                        case 32:
                            this.input
                                .find(".caleran-day[data-value='" + this.globals.keyboardHoverDate.middleOfDay().unix() + "']")
                                .first()
                                .trigger("click.caleran"),
                                (c = !1),
                                (d = !0);
                            break;
                        case 33:
                            a.shiftKey ? this.globals.keyboardHoverDate.add(-1, "years") : this.globals.keyboardHoverDate.add(-1, "months"), (c = !0), (d = !0);
                            break;
                        case 34:
                            a.shiftKey ? this.globals.keyboardHoverDate.add(1, "years") : this.globals.keyboardHoverDate.add(1, "months"), (c = !0), (d = !0);
                            break;
                        case 27:
                        case 9:
                            this.hideDropdown(a);
                            break;
                        case 36:
                            a.shiftKey && ((this.globals.keyboardHoverDate = moment().middleOfDay()), (c = !0), (d = !0));
                    }
                    if (c || d)
                        return (
                            (this.globals.keyboardHoverDate = this.globals.keyboardHoverDate.middleOfDay()),
                            (this.globals.keyboardHoverDate.isBefore(moment.unix(this.input.find(".caleran-day:first").attr("data-value")), "day") ||
                                this.globals.keyboardHoverDate.isAfter(moment.unix(this.input.find(".caleran-day:last").attr("data-value")), "day")) &&
                                ((this.globals.currentDate = this.globals.keyboardHoverDate.clone().startOfMonth()), this.reDrawCalendars(), (c = !1)),
                            c && ((this.globals.hoverDate = null), this.reDrawCells()),
                            d && this.stopBubbling(a),
                            !1
                        );
                }, this);
                this.$elem.off("keydown.caleran").on("keydown.caleran", b), this.container.off("keydown.caleran").on("keydown.caleran", b);
            }
        },
        destroy: function () {
            this.config.onBeforeDestroy(this) &&
                (this.config.inline ? (this.input.remove(), this.globals.isMobile ? this.$elem.unwrap(".caleran-container-mobile") : this.$elem.unwrap(".caleran-container"), (this.elem.type = "text")) : this.container.remove(),
                a(c).off(this.globals.documentEvent),
                this.$elem.removeData("caleran"),
                this.config.ondestroy(this));
        },
        checkMobile: function () {
            return b.matchMedia("only screen and (max-width: " + this.config.mobileBreakpoint + "px)").matches;
        },
        fixDateTime: function (a) {
            return null != a && 0 == moment.isMoment(a) && (a = "string" == typeof a ? moment(a, this.config.format).locale(this.config.locale) : moment(a).locale(this.config.locale)), a;
        },
        setStart: function (a) {
            var b = this.fixDateTime(a);
            !1 === this.isDisabled(b) && moment(b).isValid() && ((this.config.startDate = moment(b)), this.refreshValues());
        },
        setEnd: function (a) {
            var b = this.fixDateTime(a);
            !1 === this.isDisabled(b) && moment(b).isValid() && ((this.config.endDate = moment(b)), this.refreshValues());
        },
        setMinDate: function (a) {
            var b = this.fixDateTime(a);
            moment(b).isValid() && ((this.config.minDate = moment(b)), this.refreshValues());
        },
        setMaxDate: function (a) {
            var b = this.fixDateTime(a);
            moment(b).isValid() && ((this.config.maxDate = moment(b)), this.refreshValues());
        },
        setDisplayDate: function (a) {
            var b = this.fixDateTime(a);
            moment(b).isValid() && ((this.globals.currentDate = moment(b)), this.reDrawCalendars());
        },
        refreshValues: function () {
            var a = this.globals.delayInputUpdate;
            (this.globals.delayInputUpdate = !1), this.validateDates(), this.updateInput(), (this.globals.delayInputUpdate = a), this.reDrawCells();
        },
    }),
        (e.defaults = e.prototype.defaults),
        (a.fn.caleran = function (a) {
            return this.each(function () {
                new e(this, a).init();
            });
        }),
        "function" != typeof moment.fn.middleOfDay &&
            ((moment.fn.middleOfDay = function () {
                return this.hours(12).minutes(0).seconds(0), this;
            }),
            (moment.fn.startOfMonth = function () {
                return this.middleOfDay().date(1), this;
            }));
})(jQuery, window, document),
    (function (a, b, c, d) {
        "use strict";
        function e(a, b, c) {
            return setTimeout(j(a, c), b);
        }
        function f(a, b, c) {
            return !!Array.isArray(a) && (g(a, c[b], c), !0);
        }
        function g(a, b, c) {
            var e;
            if (a)
                if (a.forEach) a.forEach(b, c);
                else if (a.length !== d) for (e = 0; e < a.length; ) b.call(c, a[e], e, a), e++;
                else for (e in a) a.hasOwnProperty(e) && b.call(c, a[e], e, a);
        }
        function h(b, c, d) {
            var e = "DEPRECATED METHOD: " + c + "\n" + d + " AT \n";
            return function () {
                var c = new Error("get-stack-trace"),
                    d =
                        c && c.stack
                            ? c.stack
                                  .replace(/^[^\(]+?[\n$]/gm, "")
                                  .replace(/^\s+at\s+/gm, "")
                                  .replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@")
                            : "Unknown Stack Trace",
                    f = a.console && (a.console.warn || a.console.log);
                return f && f.call(a.console, e, d), b.apply(this, arguments);
            };
        }
        function i(a, b, c) {
            var d,
                e = b.prototype;
            (d = a.prototype = Object.create(e)), (d.constructor = a), (d._super = e), c && la(d, c);
        }
        function j(a, b) {
            return function () {
                return a.apply(b, arguments);
            };
        }
        function k(a, b) {
            return typeof a == oa ? a.apply(b ? b[0] || d : d, b) : a;
        }
        function l(a, b) {
            return a === d ? b : a;
        }
        function m(a, b, c) {
            g(q(b), function (b) {
                a.addEventListener(b, c, !1);
            });
        }
        function n(a, b, c) {
            g(q(b), function (b) {
                a.removeEventListener(b, c, !1);
            });
        }
        function o(a, b) {
            for (; a; ) {
                if (a == b) return !0;
                a = a.parentNode;
            }
            return !1;
        }
        function p(a, b) {
            return a.indexOf(b) > -1;
        }
        function q(a) {
            return a.trim().split(/\s+/g);
        }
        function r(a, b, c) {
            if (a.indexOf && !c) return a.indexOf(b);
            for (var d = 0; d < a.length; ) {
                if ((c && a[d][c] == b) || (!c && a[d] === b)) return d;
                d++;
            }
            return -1;
        }
        function s(a) {
            return Array.prototype.slice.call(a, 0);
        }
        function t(a, b, c) {
            for (var d = [], e = [], f = 0; f < a.length; ) {
                var g = b ? a[f][b] : a[f];
                r(e, g) < 0 && d.push(a[f]), (e[f] = g), f++;
            }
            return (
                c &&
                    (d = b
                        ? d.sort(function (a, c) {
                              return a[b] > c[b];
                          })
                        : d.sort()),
                d
            );
        }
        function u(a, b) {
            for (var c, e, f = b[0].toUpperCase() + b.slice(1), g = 0; g < ma.length; ) {
                if (((c = ma[g]), (e = c ? c + f : b) in a)) return e;
                g++;
            }
            return d;
        }
        function v() {
            return ua++;
        }
        function w(b) {
            var c = b.ownerDocument || b;
            return c.defaultView || c.parentWindow || a;
        }
        function x(a, b) {
            var c = this;
            (this.manager = a),
                (this.callback = b),
                (this.element = a.element),
                (this.target = a.options.inputTarget),
                (this.domHandler = function (b) {
                    k(a.options.enable, [a]) && c.handler(b);
                }),
                this.init();
        }
        function y(a) {
            var b = a.options.inputClass;
            return new (b || (xa ? M : ya ? P : wa ? R : L))(a, z);
        }
        function z(a, b, c) {
            var d = c.pointers.length,
                e = c.changedPointers.length,
                f = b & Ea && d - e == 0,
                g = b & (Ga | Ha) && d - e == 0;
            (c.isFirst = !!f), (c.isFinal = !!g), f && (a.session = {}), (c.eventType = b), A(a, c), a.emit("hammer.input", c), a.recognize(c), (a.session.prevInput = c);
        }
        function A(a, b) {
            var c = a.session,
                d = b.pointers,
                e = d.length;
            c.firstInput || (c.firstInput = D(b)), e > 1 && !c.firstMultiple ? (c.firstMultiple = D(b)) : 1 === e && (c.firstMultiple = !1);
            var f = c.firstInput,
                g = c.firstMultiple,
                h = g ? g.center : f.center,
                i = (b.center = E(d));
            (b.timeStamp = ra()), (b.deltaTime = b.timeStamp - f.timeStamp), (b.angle = I(h, i)), (b.distance = H(h, i)), B(c, b), (b.offsetDirection = G(b.deltaX, b.deltaY));
            var j = F(b.deltaTime, b.deltaX, b.deltaY);
            (b.overallVelocityX = j.x),
                (b.overallVelocityY = j.y),
                (b.overallVelocity = qa(j.x) > qa(j.y) ? j.x : j.y),
                (b.scale = g ? K(g.pointers, d) : 1),
                (b.rotation = g ? J(g.pointers, d) : 0),
                (b.maxPointers = c.prevInput ? (b.pointers.length > c.prevInput.maxPointers ? b.pointers.length : c.prevInput.maxPointers) : b.pointers.length),
                C(c, b);
            var k = a.element;
            o(b.srcEvent.target, k) && (k = b.srcEvent.target), (b.target = k);
        }
        function B(a, b) {
            var c = b.center,
                d = a.offsetDelta || {},
                e = a.prevDelta || {},
                f = a.prevInput || {};
            (b.eventType !== Ea && f.eventType !== Ga) || ((e = a.prevDelta = { x: f.deltaX || 0, y: f.deltaY || 0 }), (d = a.offsetDelta = { x: c.x, y: c.y })), (b.deltaX = e.x + (c.x - d.x)), (b.deltaY = e.y + (c.y - d.y));
        }
        function C(a, b) {
            var c,
                e,
                f,
                g,
                h = a.lastInterval || b,
                i = b.timeStamp - h.timeStamp;
            if (b.eventType != Ha && (i > Da || h.velocity === d)) {
                var j = b.deltaX - h.deltaX,
                    k = b.deltaY - h.deltaY,
                    l = F(i, j, k);
                (e = l.x), (f = l.y), (c = qa(l.x) > qa(l.y) ? l.x : l.y), (g = G(j, k)), (a.lastInterval = b);
            } else (c = h.velocity), (e = h.velocityX), (f = h.velocityY), (g = h.direction);
            (b.velocity = c), (b.velocityX = e), (b.velocityY = f), (b.direction = g);
        }
        function D(a) {
            for (var b = [], c = 0; c < a.pointers.length; ) (b[c] = { clientX: pa(a.pointers[c].clientX), clientY: pa(a.pointers[c].clientY) }), c++;
            return { timeStamp: ra(), pointers: b, center: E(b), deltaX: a.deltaX, deltaY: a.deltaY };
        }
        function E(a) {
            var b = a.length;
            if (1 === b) return { x: pa(a[0].clientX), y: pa(a[0].clientY) };
            for (var c = 0, d = 0, e = 0; e < b; ) (c += a[e].clientX), (d += a[e].clientY), e++;
            return { x: pa(c / b), y: pa(d / b) };
        }
        function F(a, b, c) {
            return { x: b / a || 0, y: c / a || 0 };
        }
        function G(a, b) {
            return a === b ? Ia : qa(a) >= qa(b) ? (a < 0 ? Ja : Ka) : b < 0 ? La : Ma;
        }
        function H(a, b, c) {
            c || (c = Qa);
            var d = b[c[0]] - a[c[0]],
                e = b[c[1]] - a[c[1]];
            return Math.sqrt(d * d + e * e);
        }
        function I(a, b, c) {
            c || (c = Qa);
            var d = b[c[0]] - a[c[0]],
                e = b[c[1]] - a[c[1]];
            return (180 * Math.atan2(e, d)) / Math.PI;
        }
        function J(a, b) {
            return I(b[1], b[0], Ra) + I(a[1], a[0], Ra);
        }
        function K(a, b) {
            return H(b[0], b[1], Ra) / H(a[0], a[1], Ra);
        }
        function L() {
            (this.evEl = Ta), (this.evWin = Ua), (this.pressed = !1), x.apply(this, arguments);
        }
        function M() {
            (this.evEl = Xa), (this.evWin = Ya), x.apply(this, arguments), (this.store = this.manager.session.pointerEvents = []);
        }
        function N() {
            (this.evTarget = $a), (this.evWin = _a), (this.started = !1), x.apply(this, arguments);
        }
        function O(a, b) {
            var c = s(a.touches),
                d = s(a.changedTouches);
            return b & (Ga | Ha) && (c = t(c.concat(d), "identifier", !0)), [c, d];
        }
        function P() {
            (this.evTarget = bb), (this.targetIds = {}), x.apply(this, arguments);
        }
        function Q(a, b) {
            var c = s(a.touches),
                d = this.targetIds;
            if (b & (Ea | Fa) && 1 === c.length) return (d[c[0].identifier] = !0), [c, c];
            var e,
                f,
                g = s(a.changedTouches),
                h = [],
                i = this.target;
            if (
                ((f = c.filter(function (a) {
                    return o(a.target, i);
                })),
                b === Ea)
            )
                for (e = 0; e < f.length; ) (d[f[e].identifier] = !0), e++;
            for (e = 0; e < g.length; ) d[g[e].identifier] && h.push(g[e]), b & (Ga | Ha) && delete d[g[e].identifier], e++;
            return h.length ? [t(f.concat(h), "identifier", !0), h] : void 0;
        }
        function R() {
            x.apply(this, arguments);
            var a = j(this.handler, this);
            (this.touch = new P(this.manager, a)), (this.mouse = new L(this.manager, a)), (this.primaryTouch = null), (this.lastTouches = []);
        }
        function S(a, b) {
            a & Ea ? ((this.primaryTouch = b.changedPointers[0].identifier), T.call(this, b)) : a & (Ga | Ha) && T.call(this, b);
        }
        function T(a) {
            var b = a.changedPointers[0];
            if (b.identifier === this.primaryTouch) {
                var c = { x: b.clientX, y: b.clientY };
                this.lastTouches.push(c);
                var d = this.lastTouches,
                    e = function () {
                        var a = d.indexOf(c);
                        a > -1 && d.splice(a, 1);
                    };
                setTimeout(e, cb);
            }
        }
        function U(a) {
            for (var b = a.srcEvent.clientX, c = a.srcEvent.clientY, d = 0; d < this.lastTouches.length; d++) {
                var e = this.lastTouches[d],
                    f = Math.abs(b - e.x),
                    g = Math.abs(c - e.y);
                if (f <= db && g <= db) return !0;
            }
            return !1;
        }
        function V(a, b) {
            (this.manager = a), this.set(b);
        }
        function W(a) {
            if (p(a, jb)) return jb;
            var b = p(a, kb),
                c = p(a, lb);
            return b && c ? jb : b || c ? (b ? kb : lb) : p(a, ib) ? ib : hb;
        }
        function X() {
            if (!fb) return !1;
            var b = {},
                c = a.CSS && a.CSS.supports;
            return (
                ["auto", "manipulation", "pan-y", "pan-x", "pan-x pan-y", "none"].forEach(function (d) {
                    b[d] = !c || a.CSS.supports("touch-action", d);
                }),
                b
            );
        }
        function Y(a) {
            (this.options = la({}, this.defaults, a || {})), (this.id = v()), (this.manager = null), (this.options.enable = l(this.options.enable, !0)), (this.state = nb), (this.simultaneous = {}), (this.requireFail = []);
        }
        function Z(a) {
            return a & sb ? "cancel" : a & qb ? "end" : a & pb ? "move" : a & ob ? "start" : "";
        }
        function $(a) {
            return a == Ma ? "down" : a == La ? "up" : a == Ja ? "left" : a == Ka ? "right" : "";
        }
        function _(a, b) {
            var c = b.manager;
            return c ? c.get(a) : a;
        }
        function aa() {
            Y.apply(this, arguments);
        }
        function ba() {
            aa.apply(this, arguments), (this.pX = null), (this.pY = null);
        }
        function ca() {
            aa.apply(this, arguments);
        }
        function da() {
            Y.apply(this, arguments), (this._timer = null), (this._input = null);
        }
        function ea() {
            aa.apply(this, arguments);
        }
        function fa() {
            aa.apply(this, arguments);
        }
        function ga() {
            Y.apply(this, arguments), (this.pTime = !1), (this.pCenter = !1), (this._timer = null), (this._input = null), (this.count = 0);
        }
        function ha(a, b) {
            return (b = b || {}), (b.recognizers = l(b.recognizers, ha.defaults.preset)), new ia(a, b);
        }
        function ia(a, b) {
            (this.options = la({}, ha.defaults, b || {})),
                (this.options.inputTarget = this.options.inputTarget || a),
                (this.handlers = {}),
                (this.session = {}),
                (this.recognizers = []),
                (this.oldCssProps = {}),
                (this.element = a),
                (this.input = y(this)),
                (this.touchAction = new V(this, this.options.touchAction)),
                ja(this, !0),
                g(
                    this.options.recognizers,
                    function (a) {
                        var b = this.add(new a[0](a[1]));
                        a[2] && b.recognizeWith(a[2]), a[3] && b.requireFailure(a[3]);
                    },
                    this
                );
        }
        function ja(a, b) {
            var c = a.element;
            if (c.style) {
                var d;
                g(a.options.cssProps, function (e, f) {
                    (d = u(c.style, f)), b ? ((a.oldCssProps[d] = c.style[d]), (c.style[d] = e)) : (c.style[d] = a.oldCssProps[d] || "");
                }),
                    b || (a.oldCssProps = {});
            }
        }
        function ka(a, c) {
            var d = b.createEvent("Event");
            d.initEvent(a, !0, !0), (d.gesture = c), c.target.dispatchEvent(d);
        }
        var la,
            ma = ["", "webkit", "Moz", "MS", "ms", "o"],
            na = b.createElement("div"),
            oa = "function",
            pa = Math.round,
            qa = Math.abs,
            ra = Date.now;
        la =
            "function" != typeof Object.assign
                ? function (a) {
                      if (a === d || null === a) throw new TypeError("Cannot convert undefined or null to object");
                      for (var b = Object(a), c = 1; c < arguments.length; c++) {
                          var e = arguments[c];
                          if (e !== d && null !== e) for (var f in e) e.hasOwnProperty(f) && (b[f] = e[f]);
                      }
                      return b;
                  }
                : Object.assign;
        var sa = h(
                function (a, b, c) {
                    for (var e = Object.keys(b), f = 0; f < e.length; ) (!c || (c && a[e[f]] === d)) && (a[e[f]] = b[e[f]]), f++;
                    return a;
                },
                "extend",
                "Use `assign`."
            ),
            ta = h(
                function (a, b) {
                    return sa(a, b, !0);
                },
                "merge",
                "Use `assign`."
            ),
            ua = 1,
            va = /mobile|tablet|ip(ad|hone|od)|android/i,
            wa = "ontouchstart" in a,
            xa = u(a, "PointerEvent") !== d,
            ya = wa && va.test(navigator.userAgent),
            za = "touch",
            Aa = "pen",
            Ba = "mouse",
            Ca = "kinect",
            Da = 25,
            Ea = 1,
            Fa = 2,
            Ga = 4,
            Ha = 8,
            Ia = 1,
            Ja = 2,
            Ka = 4,
            La = 8,
            Ma = 16,
            Na = Ja | Ka,
            Oa = La | Ma,
            Pa = Na | Oa,
            Qa = ["x", "y"],
            Ra = ["clientX", "clientY"];
        x.prototype = {
            handler: function () {},
            init: function () {
                this.evEl && m(this.element, this.evEl, this.domHandler), this.evTarget && m(this.target, this.evTarget, this.domHandler), this.evWin && m(w(this.element), this.evWin, this.domHandler);
            },
            destroy: function () {
                this.evEl && n(this.element, this.evEl, this.domHandler), this.evTarget && n(this.target, this.evTarget, this.domHandler), this.evWin && n(w(this.element), this.evWin, this.domHandler);
            },
        };
        var Sa = { mousedown: Ea, mousemove: Fa, mouseup: Ga },
            Ta = "mousedown",
            Ua = "mousemove mouseup";
        i(L, x, {
            handler: function (a) {
                var b = Sa[a.type];
                b & Ea && 0 === a.button && (this.pressed = !0),
                    b & Fa && 1 !== a.which && (b = Ga),
                    this.pressed && (b & Ga && (this.pressed = !1), this.callback(this.manager, b, { pointers: [a], changedPointers: [a], pointerType: Ba, srcEvent: a }));
            },
        });
        var Va = { pointerdown: Ea, pointermove: Fa, pointerup: Ga, pointercancel: Ha, pointerout: Ha },
            Wa = { 2: za, 3: Aa, 4: Ba, 5: Ca },
            Xa = "pointerdown",
            Ya = "pointermove pointerup pointercancel";
        a.MSPointerEvent && !a.PointerEvent && ((Xa = "MSPointerDown"), (Ya = "MSPointerMove MSPointerUp MSPointerCancel")),
            i(M, x, {
                handler: function (a) {
                    var b = this.store,
                        c = !1,
                        d = a.type.toLowerCase().replace("ms", ""),
                        e = Va[d],
                        f = Wa[a.pointerType] || a.pointerType,
                        g = f == za,
                        h = r(b, a.pointerId, "pointerId");
                    e & Ea && (0 === a.button || g) ? h < 0 && (b.push(a), (h = b.length - 1)) : e & (Ga | Ha) && (c = !0),
                        h < 0 || ((b[h] = a), this.callback(this.manager, e, { pointers: b, changedPointers: [a], pointerType: f, srcEvent: a }), c && b.splice(h, 1));
                },
            });
        var Za = { touchstart: Ea, touchmove: Fa, touchend: Ga, touchcancel: Ha },
            $a = "touchstart",
            _a = "touchstart touchmove touchend touchcancel";
        i(N, x, {
            handler: function (a) {
                var b = Za[a.type];
                if ((b === Ea && (this.started = !0), this.started)) {
                    var c = O.call(this, a, b);
                    b & (Ga | Ha) && c[0].length - c[1].length == 0 && (this.started = !1), this.callback(this.manager, b, { pointers: c[0], changedPointers: c[1], pointerType: za, srcEvent: a });
                }
            },
        });
        var ab = { touchstart: Ea, touchmove: Fa, touchend: Ga, touchcancel: Ha },
            bb = "touchstart touchmove touchend touchcancel";
        i(P, x, {
            handler: function (a) {
                var b = ab[a.type],
                    c = Q.call(this, a, b);
                c && this.callback(this.manager, b, { pointers: c[0], changedPointers: c[1], pointerType: za, srcEvent: a });
            },
        });
        var cb = 2500,
            db = 25;
        i(R, x, {
            handler: function (a, b, c) {
                var d = c.pointerType == za,
                    e = c.pointerType == Ba;
                if (!(e && c.sourceCapabilities && c.sourceCapabilities.firesTouchEvents)) {
                    if (d) S.call(this, b, c);
                    else if (e && U.call(this, c)) return;
                    this.callback(a, b, c);
                }
            },
            destroy: function () {
                this.touch.destroy(), this.mouse.destroy();
            },
        });
        var eb = u(na.style, "touchAction"),
            fb = eb !== d,
            gb = "compute",
            hb = "auto",
            ib = "manipulation",
            jb = "none",
            kb = "pan-x",
            lb = "pan-y",
            mb = X();
        V.prototype = {
            set: function (a) {
                a == gb && (a = this.compute()), fb && this.manager.element.style && mb[a] && (this.manager.element.style[eb] = a), (this.actions = a.toLowerCase().trim());
            },
            update: function () {
                this.set(this.manager.options.touchAction);
            },
            compute: function () {
                var a = [];
                return (
                    g(this.manager.recognizers, function (b) {
                        k(b.options.enable, [b]) && (a = a.concat(b.getTouchAction()));
                    }),
                    W(a.join(" "))
                );
            },
            preventDefaults: function (a) {
                var b = a.srcEvent,
                    c = a.offsetDirection;
                if (this.manager.session.prevented) return void b.preventDefault();
                var d = this.actions,
                    e = p(d, jb) && !mb[jb],
                    f = p(d, lb) && !mb[lb],
                    g = p(d, kb) && !mb[kb];
                if (e) {
                    var h = 1 === a.pointers.length,
                        i = a.distance < 2,
                        j = a.deltaTime < 250;
                    if (h && i && j) return;
                }
                return g && f ? void 0 : e || (f && c & Na) || (g && c & Oa) ? this.preventSrc(b) : void 0;
            },
            preventSrc: function (a) {
                (this.manager.session.prevented = !0), a.preventDefault();
            },
        };
        var nb = 1,
            ob = 2,
            pb = 4,
            qb = 8,
            rb = qb,
            sb = 16,
            tb = 32;
        (Y.prototype = {
            defaults: {},
            set: function (a) {
                return la(this.options, a), this.manager && this.manager.touchAction.update(), this;
            },
            recognizeWith: function (a) {
                if (f(a, "recognizeWith", this)) return this;
                var b = this.simultaneous;
                return (a = _(a, this)), b[a.id] || ((b[a.id] = a), a.recognizeWith(this)), this;
            },
            dropRecognizeWith: function (a) {
                return f(a, "dropRecognizeWith", this) ? this : ((a = _(a, this)), delete this.simultaneous[a.id], this);
            },
            requireFailure: function (a) {
                if (f(a, "requireFailure", this)) return this;
                var b = this.requireFail;
                return (a = _(a, this)), -1 === r(b, a) && (b.push(a), a.requireFailure(this)), this;
            },
            dropRequireFailure: function (a) {
                if (f(a, "dropRequireFailure", this)) return this;
                a = _(a, this);
                var b = r(this.requireFail, a);
                return b > -1 && this.requireFail.splice(b, 1), this;
            },
            hasRequireFailures: function () {
                return this.requireFail.length > 0;
            },
            canRecognizeWith: function (a) {
                return !!this.simultaneous[a.id];
            },
            emit: function (a) {
                function b(b) {
                    c.manager.emit(b, a);
                }
                var c = this,
                    d = this.state;
                d < qb && b(c.options.event + Z(d)), b(c.options.event), a.additionalEvent && b(a.additionalEvent), d >= qb && b(c.options.event + Z(d));
            },
            tryEmit: function (a) {
                if (this.canEmit()) return this.emit(a);
                this.state = tb;
            },
            canEmit: function () {
                for (var a = 0; a < this.requireFail.length; ) {
                    if (!(this.requireFail[a].state & (tb | nb))) return !1;
                    a++;
                }
                return !0;
            },
            recognize: function (a) {
                var b = la({}, a);
                if (!k(this.options.enable, [this, b])) return this.reset(), void (this.state = tb);
                this.state & (rb | sb | tb) && (this.state = nb), (this.state = this.process(b)), this.state & (ob | pb | qb | sb) && this.tryEmit(b);
            },
            process: function (a) {},
            getTouchAction: function () {},
            reset: function () {},
        }),
            i(aa, Y, {
                defaults: { pointers: 1 },
                attrTest: function (a) {
                    var b = this.options.pointers;
                    return 0 === b || a.pointers.length === b;
                },
                process: function (a) {
                    var b = this.state,
                        c = a.eventType,
                        d = b & (ob | pb),
                        e = this.attrTest(a);
                    return d && (c & Ha || !e) ? b | sb : d || e ? (c & Ga ? b | qb : b & ob ? b | pb : ob) : tb;
                },
            }),
            i(ba, aa, {
                defaults: { event: "pan", threshold: 10, pointers: 1, direction: Pa },
                getTouchAction: function () {
                    var a = this.options.direction,
                        b = [];
                    return a & Na && b.push(lb), a & Oa && b.push(kb), b;
                },
                directionTest: function (a) {
                    var b = this.options,
                        c = !0,
                        d = a.distance,
                        e = a.direction,
                        f = a.deltaX,
                        g = a.deltaY;
                    return (
                        e & b.direction || (b.direction & Na ? ((e = 0 === f ? Ia : f < 0 ? Ja : Ka), (c = f != this.pX), (d = Math.abs(a.deltaX))) : ((e = 0 === g ? Ia : g < 0 ? La : Ma), (c = g != this.pY), (d = Math.abs(a.deltaY)))),
                        (a.direction = e),
                        c && d > b.threshold && e & b.direction
                    );
                },
                attrTest: function (a) {
                    return aa.prototype.attrTest.call(this, a) && (this.state & ob || (!(this.state & ob) && this.directionTest(a)));
                },
                emit: function (a) {
                    (this.pX = a.deltaX), (this.pY = a.deltaY);
                    var b = $(a.direction);
                    b && (a.additionalEvent = this.options.event + b), this._super.emit.call(this, a);
                },
            }),
            i(ca, aa, {
                defaults: { event: "pinch", threshold: 0, pointers: 2 },
                getTouchAction: function () {
                    return [jb];
                },
                attrTest: function (a) {
                    return this._super.attrTest.call(this, a) && (Math.abs(a.scale - 1) > this.options.threshold || this.state & ob);
                },
                emit: function (a) {
                    if (1 !== a.scale) {
                        var b = a.scale < 1 ? "in" : "out";
                        a.additionalEvent = this.options.event + b;
                    }
                    this._super.emit.call(this, a);
                },
            }),
            i(da, Y, {
                defaults: { event: "press", pointers: 1, time: 251, threshold: 9 },
                getTouchAction: function () {
                    return [hb];
                },
                process: function (a) {
                    var b = this.options,
                        c = a.pointers.length === b.pointers,
                        d = a.distance < b.threshold,
                        f = a.deltaTime > b.time;
                    if (((this._input = a), !d || !c || (a.eventType & (Ga | Ha) && !f))) this.reset();
                    else if (a.eventType & Ea)
                        this.reset(),
                            (this._timer = e(
                                function () {
                                    (this.state = rb), this.tryEmit();
                                },
                                b.time,
                                this
                            ));
                    else if (a.eventType & Ga) return rb;
                    return tb;
                },
                reset: function () {
                    clearTimeout(this._timer);
                },
                emit: function (a) {
                    this.state === rb && (a && a.eventType & Ga ? this.manager.emit(this.options.event + "up", a) : ((this._input.timeStamp = ra()), this.manager.emit(this.options.event, this._input)));
                },
            }),
            i(ea, aa, {
                defaults: { event: "rotate", threshold: 0, pointers: 2 },
                getTouchAction: function () {
                    return [jb];
                },
                attrTest: function (a) {
                    return this._super.attrTest.call(this, a) && (Math.abs(a.rotation) > this.options.threshold || this.state & ob);
                },
            }),
            i(fa, aa, {
                defaults: { event: "swipe", threshold: 10, velocity: 0.3, direction: Na | Oa, pointers: 1 },
                getTouchAction: function () {
                    return ba.prototype.getTouchAction.call(this);
                },
                attrTest: function (a) {
                    var b,
                        c = this.options.direction;
                    return (
                        c & (Na | Oa) ? (b = a.overallVelocity) : c & Na ? (b = a.overallVelocityX) : c & Oa && (b = a.overallVelocityY),
                        this._super.attrTest.call(this, a) && c & a.offsetDirection && a.distance > this.options.threshold && a.maxPointers == this.options.pointers && qa(b) > this.options.velocity && a.eventType & Ga
                    );
                },
                emit: function (a) {
                    var b = $(a.offsetDirection);
                    b && this.manager.emit(this.options.event + b, a), this.manager.emit(this.options.event, a);
                },
            }),
            i(ga, Y, {
                defaults: { event: "tap", pointers: 1, taps: 1, interval: 300, time: 250, threshold: 9, posThreshold: 10 },
                getTouchAction: function () {
                    return [ib];
                },
                process: function (a) {
                    var b = this.options,
                        c = a.pointers.length === b.pointers,
                        d = a.distance < b.threshold,
                        f = a.deltaTime < b.time;
                    if ((this.reset(), a.eventType & Ea && 0 === this.count)) return this.failTimeout();
                    if (d && f && c) {
                        if (a.eventType != Ga) return this.failTimeout();
                        var g = !this.pTime || a.timeStamp - this.pTime < b.interval,
                            h = !this.pCenter || H(this.pCenter, a.center) < b.posThreshold;
                        (this.pTime = a.timeStamp), (this.pCenter = a.center), h && g ? (this.count += 1) : (this.count = 1), (this._input = a);
                        if (0 === this.count % b.taps)
                            return this.hasRequireFailures()
                                ? ((this._timer = e(
                                      function () {
                                          (this.state = rb), this.tryEmit();
                                      },
                                      b.interval,
                                      this
                                  )),
                                  ob)
                                : rb;
                    }
                    return tb;
                },
                failTimeout: function () {
                    return (
                        (this._timer = e(
                            function () {
                                this.state = tb;
                            },
                            this.options.interval,
                            this
                        )),
                        tb
                    );
                },
                reset: function () {
                    clearTimeout(this._timer);
                },
                emit: function () {
                    this.state == rb && ((this._input.tapCount = this.count), this.manager.emit(this.options.event, this._input));
                },
            }),
            (ha.VERSION = "2.0.8"),
            (ha.defaults = {
                domEvents: !1,
                touchAction: gb,
                enable: !0,
                inputTarget: null,
                inputClass: null,
                preset: [[ea, { enable: !1 }], [ca, { enable: !1 }, ["rotate"]], [fa, { direction: Na }], [ba, { direction: Na }, ["swipe"]], [ga], [ga, { event: "doubletap", taps: 2 }, ["tap"]], [da]],
                cssProps: { userSelect: "none", touchSelect: "none", touchCallout: "none", contentZooming: "none", userDrag: "none", tapHighlightColor: "rgba(0,0,0,0)" },
            });
        var ub = 2;
        (ia.prototype = {
            set: function (a) {
                return la(this.options, a), a.touchAction && this.touchAction.update(), a.inputTarget && (this.input.destroy(), (this.input.target = a.inputTarget), this.input.init()), this;
            },
            stop: function (a) {
                this.session.stopped = a ? ub : 1;
            },
            recognize: function (a) {
                var b = this.session;
                if (!b.stopped) {
                    this.touchAction.preventDefaults(a);
                    var c,
                        d = this.recognizers,
                        e = b.curRecognizer;
                    (!e || (e && e.state & rb)) && (e = b.curRecognizer = null);
                    for (var f = 0; f < d.length; ) (c = d[f]), b.stopped === ub || (e && c != e && !c.canRecognizeWith(e)) ? c.reset() : c.recognize(a), !e && c.state & (ob | pb | qb) && (e = b.curRecognizer = c), f++;
                }
            },
            get: function (a) {
                if (a instanceof Y) return a;
                for (var b = this.recognizers, c = 0; c < b.length; c++) if (b[c].options.event == a) return b[c];
                return null;
            },
            add: function (a) {
                if (f(a, "add", this)) return this;
                var b = this.get(a.options.event);
                return b && this.remove(b), this.recognizers.push(a), (a.manager = this), this.touchAction.update(), a;
            },
            remove: function (a) {
                if (f(a, "remove", this)) return this;
                if ((a = this.get(a))) {
                    var b = this.recognizers,
                        c = r(b, a);
                    -1 !== c && (b.splice(c, 1), this.touchAction.update());
                }
                return this;
            },
            on: function (a, b) {
                if (a !== d && b !== d) {
                    var c = this.handlers;
                    return (
                        g(q(a), function (a) {
                            (c[a] = c[a] || []), c[a].push(b);
                        }),
                        this
                    );
                }
            },
            off: function (a, b) {
                if (a !== d) {
                    var c = this.handlers;
                    return (
                        g(q(a), function (a) {
                            b ? c[a] && c[a].splice(r(c[a], b), 1) : delete c[a];
                        }),
                        this
                    );
                }
            },
            emit: function (a, b) {
                this.options.domEvents && ka(a, b);
                var c = this.handlers[a] && this.handlers[a].slice();
                if (c && c.length) {
                    (b.type = a),
                        (b.preventDefault = function () {
                            b.srcEvent.preventDefault();
                        });
                    for (var d = 0; d < c.length; ) c[d](b), d++;
                }
            },
            destroy: function () {
                this.element && ja(this, !1), (this.handlers = {}), (this.session = {}), this.input.destroy(), (this.element = null);
            },
        }),
            la(ha, {
                INPUT_START: Ea,
                INPUT_MOVE: Fa,
                INPUT_END: Ga,
                INPUT_CANCEL: Ha,
                STATE_POSSIBLE: nb,
                STATE_BEGAN: ob,
                STATE_CHANGED: pb,
                STATE_ENDED: qb,
                STATE_RECOGNIZED: rb,
                STATE_CANCELLED: sb,
                STATE_FAILED: tb,
                DIRECTION_NONE: Ia,
                DIRECTION_LEFT: Ja,
                DIRECTION_RIGHT: Ka,
                DIRECTION_UP: La,
                DIRECTION_DOWN: Ma,
                DIRECTION_HORIZONTAL: Na,
                DIRECTION_VERTICAL: Oa,
                DIRECTION_ALL: Pa,
                Manager: ia,
                Input: x,
                TouchAction: V,
                TouchInput: P,
                MouseInput: L,
                PointerEventInput: M,
                TouchMouseInput: R,
                SingleTouchInput: N,
                Recognizer: Y,
                AttrRecognizer: aa,
                Tap: ga,
                Pan: ba,
                Swipe: fa,
                Pinch: ca,
                Rotate: ea,
                Press: da,
                on: m,
                off: n,
                each: g,
                merge: ta,
                extend: sa,
                assign: la,
                inherit: i,
                bindFn: j,
                prefixed: u,
            }),
            ((void 0 !== a ? a : "undefined" != typeof self ? self : {}).Hammer = ha),
            "function" == typeof define && define.amd
                ? define(function () {
                      return ha;
                  })
                : "undefined" != typeof module && module.exports
                ? (module.exports = ha)
                : (a[c] = ha);
    })(window, document, "Hammer");
//# sourceMappingURL=caleran.min.map
