define(["require", "exports", "@syncfusion/ej2-schedule", "./datasource", "@syncfusion/ej2-base"], function (require, exports, ej2_schedule_1, datasource_1, ej2_base_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ej2_schedule_1.Schedule.Inject(ej2_schedule_1.Day);
    var isReadOnly = function (data) {
        return (data.EndTime < new Date(2018, 6, 31, 0, 0));
    };
    var data = ej2_base_1.extend([], datasource_1.roomData, null, true);
    var scheduleOptions = {
        width: '100%',
        height: '850px',
        currentView: "Day",
        selectedDate: new Date(2018, 6, 31),
        resourceHeaderTemplate: '#resourceTemplate',
        showWeekend: false,
        group: {
            resources: ['Rooms'],
            byDate: true,
            enableCompactView: false
        },
        workHours: { start: '08:00' },
        resources: [{
                field: 'RoomId', title: 'Select Room', name: 'Rooms',
                dataSource: [
                    { text: 'Jammy Cool', id: 1, capacity: 20, type: 'Conference' },
                    { text: 'Tweety Nest', id: 2, capacity: 7, type: 'Cabin' },
                    { text: 'Rounded Corner', id: 3, capacity: 5, type: 'Cabin' },
                    { text: 'Scenic View Hall', id: 4, capacity: 15, type: 'Conference' },
                    { text: 'Mission Hall', id: 5, capacity: 25, type: 'Conference' }
                ],
                textField: 'text', idField: 'id'
            }],
        views: ['Day'],
        eventSettings: {
            dataSource: data,
            enableTooltip: true,
            tooltipTemplate: '#tooltipTemplate',
            fields: {
                subject: { title: 'Summary', name: 'Subject' },
                location: { title: 'Location', name: 'Location' },
                description: { title: 'Comments', name: 'Description' },
                startTime: { title: 'From', name: 'StartTime' },
                endTime: { title: 'To', name: 'EndTime' }
            }
        },
        popupOpen: function (args) {
            if (this.shouldCancelPopup(args)) {
                args.cancel = true;
            }
        },
        
        shouldCancelPopup: function (args) {
            var data = args.data;
            return isReadOnly(data) || 
                   args.target.classList.contains('lunch-break') || 
                   args.target.classList.contains('maintenance') || 
                   args.target.classList.contains('e-read-only-cells') || 
                   !scheduleObj.isSlotAvailable(data.startTime, data.endTime, data.groupIndex);
        },
        
        renderCell: function (args) {
            if (args.element.classList.contains('e-work-cells')) {
                this.applyGroupStyles(args);
                this.checkForLunchBreak(args);
                this.checkForMaintenance(args);
                this.applyReadOnlyStatus(args);
            }
        },
        
        applyGroupStyles: function (args) {
            const groupClasses = ['jammy', 'tweety', 'rounded', 'scenic', 'mission'];
            const index = parseInt(args.element.getAttribute('data-group-index'), 10);
            ej2_base_1.addClass([args.element], groupClasses[index]);
        },
        
        checkForLunchBreak: function (args) {
            if (args.date.getHours() === 13) {
                ej2_base_1.addClass([args.element], 'lunch-break');
            }
        },
        
        checkForMaintenance: function (args) {
            const classNames = args.element.classList;
            const hour = args.date.getHours();
            const minute = args.date.getMinutes();
        
            const isMaintenanceTime = (
                (classNames.contains('jammy') || classNames.contains('rounded') || classNames.contains('mission')) && 
                (hour === 8 && minute === 0)
              ) ||
              (
                (classNames.contains('tweety') || classNames.contains('scenic')) && 
                (hour === 14 && minute === 0)
              ) ||
              (
                (classNames.contains('rounded') || classNames.contains('mission')) && 
                (hour === 17 && minute === 0)
              );
        
            if (isMaintenanceTime) {
                ej2_base_1.addClass([args.element], 'maintenance');
            }
        },
        
        applyReadOnlyStatus: function (args) {
            const readOnlyDate = new Date(2018, 6, 31, 0, 0);
            if (args.date < readOnlyDate) {
                args.element.setAttribute('aria-readonly', 'true');
                args.element.classList.add('e-read-only-cells');
            }
        }
