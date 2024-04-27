import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Row, Grid } from "react-native-paper-grid";

import Header from '../../../components/Header';
import GridField from '../../../components/inputs/GridField';


const ETAMap = {
  eta: {
    title: 'ARRIVAL',
    postfix: 'A',
    portTitle: 'Port in',
    portKey: 'port_in_name',
    placeTitle: 'Place from',
    placeKey: 'place_from',
  },
  etd: {
    title: 'DEPARTURE',
    postfix: 'D',
    portTitle: 'Port out',
    portKey: 'port_out_name',
    placeTitle: 'Place to',
    placeKey: 'place_to',
  },
};

const styles = StyleSheet.create({
  gridField: {
    backgroundColor: '#F5FBFF',
  },
  sectionTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

const SafeScrollWrapper = ({ children }) => (
  <SafeAreaView style={{ flex: 1 }}>
    <ScrollView>
      {children}
    </ScrollView>
  </SafeAreaView>
);

const MainSection = ({ data, ...rest }) => (
  <SafeScrollWrapper>
    <Grid style={styles.container}>
      <Row style={styles.sectionTitleContainer}>
        <Header>Main Section</Header>
      </Row>
      <Row>
        <GridField value={data.id} label="ID" />
      </Row>
      <Row>
        <GridField value={data.reference} label="Reference" />
      </Row>
      <Row>
        <GridField value={data.service_name} label="Service"/>
      </Row>
      <Row>
        <GridField value={data.status_name} label="Status"/>
      </Row>
      <Row>
        <GridField value={data.priority} label="Priority"/>
      </Row>
      <Row>
        <GridField value={data.terminal_name} label="Terminal"/>
      </Row>
    </Grid>
  </SafeScrollWrapper>
);

const ETAETDSection = ({ data, prefix, ...rest }) => (
  <SafeScrollWrapper>
    <Grid style={styles.container}>
      <Row style={styles.sectionTitleContainer}>
        <Header>ETA — {ETAMap[prefix].title} — TRUCK</Header>
      </Row>
      <Row>
        <GridField 
          value={data[`${prefix}_date`]} 
          label={`ETA-${ETAMap[prefix].postfix} date`} 
        />
        <GridField 
          value={data[`${prefix}_time`]} 
          label={`ETA-${ETAMap[prefix].postfix} time`} 
        />
      </Row>
      <Row>
        <GridField 
          value={data[`${prefix}_slot_time`]} 
          label={`ETA-${ETAMap[prefix].postfix} slot time`} 
        />
        <GridField 
          value={data[ETAMap[prefix].portKey]} 
          label={ETAMap[prefix].portTitle} 
        />
      </Row>
      <Row>
        <GridField 
          value={data[`${prefix}_3rd_party_name`]} 
          label={`ETA-${ETAMap[prefix].postfix} 3rd party`} 
        />
        <GridField 
          value={data[ETAMap[prefix].placeKey]} 
          label={ETAMap[prefix].placeTitle} 
        />
      </Row>
      <Row>
        <GridField 
          value={data[`${prefix}_show_doc_for_trans`]} 
          label={`ETA-${ETAMap[prefix].postfix} show docs`} 
        />
        <GridField 
          value={data[`${prefix}_driver_name`]} 
          label={`ETA-${ETAMap[prefix].postfix} driver`} 
        />
      </Row>
      <Row>
        <GridField 
          value={data[`${prefix}_driver_phone`]} 
          label={`ETA-${ETAMap[prefix].postfix} driver phone`} 
        />
        <GridField 
          value={data[`${prefix}_truck_name`]} 
          label={`ETA-${ETAMap[prefix].postfix} truck`} 
        />
      </Row>
      <Row>
        <GridField 
          value={data[`${prefix}_trailer_name`]} 
          label={`ETA-${ETAMap[prefix].postfix} trailer`} 
        />
      </Row>
    </Grid>
  </SafeScrollWrapper>
);
  
const SplitPlumbSection = ({ data, ...rest }) => (
  <SafeScrollWrapper>
    <Grid style={styles.container}>
      <Row style={styles.sectionTitleContainer}>
        <Header>Split Load</Header>
      </Row>
      <Row>
        <GridField 
          value={data['split_load']} 
          label="Split Load"
        />
      </Row>
      <Row>
        <GridField 
          value={data['trip_number']} 
          label="Trip no"
        />
      </Row>
      <Row>
        <GridField 
          value={data['loading_order']} 
          label="Loading Order"
        />
      </Row>
      <Row style={styles.sectionTitleContainer}>
        <Header>Plumb Seal</Header>
      </Row>
      <Row>
        <GridField 
          value={data['plumb_seal']} 
          label="Plumb/Seal"
        />
      </Row>
      <Row>
        <GridField 
          value={data['plumb_number']}
          label="Plumb number"
        />
      </Row>
    </Grid>
  </SafeScrollWrapper>
);
  
const StorageOtherSection = ({ data, ...rest }) => (
  <SafeScrollWrapper>
    <Grid style={styles.container}>
      <Row style={styles.sectionTitleContainer}>
        <Header>Storage Allocation</Header>
      </Row>
      <Row>
        <GridField 
          value={data['area_name']}
          label="Area"
        />
        <GridField 
          value={data['is_area_blocked']}
          label="Is area blocked"
        />
      </Row>
      <Row>
        <GridField 
          value={data['label_source']}
          label="Label Source"
        />
        <GridField 
          value={data['label']}
          label="Label"
        />
      </Row>
      <Row style={styles.sectionTitleContainer}>
        <Header>Other</Header>
      </Row>
      <Row>
        <GridField 
          value={data['printed_doc']}
          label="Printed DOC"
        />
        <GridField 
          value={data['commodity']}
          label="Commodity"
        />
      </Row>
      <Row>
        <GridField 
          value={data['pallets']}
          label="Pallets"
        />
        <GridField 
          value={data['boxes']}
          label="Boxes"
        />
      </Row>
      <Row>
        <GridField 
          value={data['kilos']}
          label="Kilos"
        />
      </Row>
    </Grid>
  </SafeScrollWrapper>
);


export { 
  MainSection, ETAETDSection,
  SplitPlumbSection, StorageOtherSection, 
};
