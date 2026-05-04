import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar({ onSearch, onLocationPress, textColor }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputWrapper, { borderColor: `${textColor}55` }]}>
        <Ionicons name="search" size={20} color={textColor} style={styles.searchIcon} />
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder="Search city..."
          placeholderTextColor={`${textColor}99`}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color={textColor} />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={[styles.locationBtn, { borderColor: `${textColor}55` }]}
        onPress={onLocationPress}
      >
        <Ionicons name="locate" size={22} color={textColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 30,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
  },
  locationBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 30,
    borderWidth: 1,
    padding: 12,
  },
});
