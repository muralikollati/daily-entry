import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getPersonDetails} from '../services/api';
import {useAuth} from '../contexts/AuthProvider';
import QuantityBreakdown from './QuantityBreakDown';
import {formatDate} from '../utils/helper';
import {useTheme} from '../contexts/theme/ThemeContext';
import { getEntryDetailsListCall } from '../services/firebaseApi';

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

  const {token} = useAuth();
  const theme = useTheme();
  const styles = getStyles(theme);

  const getPersionDetails = async () => {
    setLoading(true);
    const details: any =  await getEntryDetailsListCall(id)
    // const details = await getPersonDetails(id as string, token);
    setData(details?.data);
    setLoading(false);
  };

  useEffect(() => {
    getPersionDetails();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      {loading && (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      )}
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.row}>
            <QuantityBreakdown
              selected_date={formatDate(item.selected_date)}
              quantities={item.quantity_entries}
            />
          </View>
        )}
      />
    </View>
  );
}

const getStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {flex: 1, padding: 16, backgroundColor: theme.colors.background},
    title: {fontSize: 24, marginBottom: 10, fontFamily: theme.fonts.bold, color: theme.colors.primary},
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.secondary,
      borderRadius: 12,
      marginBottom: 8,
      padding: 10,
    },
  });
