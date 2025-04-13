import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';
import {View, Text, FlatList, StyleSheet, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getPersonDetails} from '../services/api';
import { useAuth } from '../contexts/AuthProvider';
import QuantityBreakdown from './QuantityBreakDown';
import { formatDate } from '../utils/helper';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

type ItemEntry = {
  id: string;
  selected_date: string;
  created_date: string;
  modified_date: string;
  item: string;
  quantity_entries: number[];
};

export default function EntryDetails() {
  const route = useRoute<DetailScreenRouteProp>();
  const {id, name} = route.params;
  const [data, setData] = useState<ItemEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth()

  const getPersionDetails = async () => {
    setLoading(true);
    const details = await getPersonDetails(id as string, token);
    setData(details);
    setLoading(false);
  };

  useEffect(() => {
    getPersionDetails();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.row}>
            <QuantityBreakdown
              selected_date={formatDate(item.created_date)}
              quantities={item.quantity_entries}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#ffffff'},
  title: {fontSize: 24, fontWeight: 'bold',marginBottom: 10},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F5FF',
    borderRadius: 12,
    marginBottom: 8,
    padding: 10,
  },
});
