define([
  // collection components
  "rbs/components/collection/Alerts", "rbs/components/collection/Div", "rbs/components/collection/Rows", "rbs/components/collection/SelectResults", "rbs/components/collection/TableBody",
  // combo components
  "rbs/components/combo/Table",
  // control components
  "rbs/components/controls/AttributeBinder", "rbs/components/controls/Button", "rbs/components/controls/Colorpicker", "rbs/components/controls/Datepicker", "rbs/components/controls/DynamicInput",
  "rbs/components/controls/LoadingWrapper", "rbs/components/controls/Pagination", "rbs/components/controls/Select", "rbs/components/controls/TableHead", "rbs/components/controls/Tappable", "rbs/components/controls/TimeoutTransitionGroup",
  "rbs/components/controls/Timepicker", "rbs/components/controls/WaitingTransitionGroup",
  // layout components
  "rbs/components/layout/Alert", "rbs/components/layout/Dropdown", "rbs/components/layout/DropdownItem", "rbs/components/layout/FixToTop", "rbs/components/layout/Form", "rbs/components/layout/Icon", "rbs/components/layout/Modal", "rbs/components/layout/Navbar", "rbs/components/layout/NavbarDropdown", "rbs/components/layout/NavbarGroup", "rbs/components/layout/NavbarLink", "rbs/components/layout/ProgressBar", "rbs/components/layout/Tip",
  // mixins
  "rbs/components/mixins/Collection", "rbs/components/mixins/Events", "rbs/components/mixins/FormGroup", "rbs/components/mixins/Model", "rbs/components/mixins/NavbarHelper", "rbs/components/mixins/OnClickOutside", "rbs/components/mixins/Timer",
  // model components
  "rbs/components/model/Alert", "rbs/components/model/Div", "rbs/components/model/Form", "rbs/components/model/GridRow", "rbs/components/model/SimpleOption", "rbs/components/model/TableRow"
], function (CollectionAlerts, CollectionDiv, CollectionRows, CollectionSelectResults, CollectionTableBody,
             Table,
             AttributeBinder, Button, Colorpicker, Datepicker, DynamicInput, LoadingWrapper, Pagination, Select, TableHead, Tappable, TimeoutTransitionGroup, Timepicker, WaitingTransitionGroup,
             LayoutAlert, Dropdown, DropdownItem, FixToTop, Form, Icon, Modal, Navbar, NavbarDropdown, NavbarGroup, NavbarLink, ProgressBar, Tip,
             Collection, Events, FormGroup, Model, NavbarHelper, OnClickOutside, Timer,
             ModelAlert, ModelDiv, ModelForm, ModelGridRow, ModelSimpleOption, ModelTableRow) {
  return {
    components: {
      collection: {
        Alerts: CollectionAlerts,
        Div: CollectionDiv,
        Rows: CollectionRows,
        SelectResults: CollectionSelectResults,
        TableBody: CollectionTableBody
      },
      combo: {
        Table: Table
      },
      controls: {
        AttributeBinder: AttributeBinder,
        Button: Button,
        Colorpicker: Colorpicker,
        Datepicker: Datepicker,
        DynamicInput: DynamicInput,
        LoadingWrapper: LoadingWrapper,
        Pagination: Pagination,
        Select: Select,
        TableHead: TableHead,
        Tappable: Tappable,
        TimeoutTransitionGroup: TimeoutTransitionGroup,
        Timepicker: Timepicker,
        WaitingTransitionGroup: WaitingTransitionGroup
      },
      layout: {
        Alert: LayoutAlert,
        Dropdown: Dropdown,
        DropdownItem: DropdownItem,
        FixToTop: FixToTop,
        Form: Form,
        Icon: Icon,
        Modal: Modal,
        Navbar: Navbar,
        NavbarDropdown: NavbarDropdown,
        NavbarGroup: NavbarGroup,
        NavbarLink: NavbarLink,
        ProgressBar: ProgressBar,
        Tip: Tip
      },
      mixins: {
        Collection: Collection,
        Events: Events,
        FormGroup: FormGroup,
        Model: Model,
        NavbarHelper: NavbarHelper,
        OnClickOutside: OnClickOutside,
        Timer: Timer
      },
      model: {
        Alert: ModelAlert,
        Div: ModelDiv,
        Form: ModelForm,
        GridRow: ModelGridRow,
        SimpleOption: ModelSimpleOption,
        TableRow: ModelTableRow
      }
    }
  };
});