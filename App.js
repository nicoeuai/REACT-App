import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, TextInput, Button, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { modules } from './src/modules';

function ModuleList({ onSelect }) {
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Module</Text>
      <FlatList
        data={modules}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelect(item)} style={{ paddingVertical: 12 }}>
            <Text style={{ fontSize: 18 }}>{item.id}. {item.title}</Text>
            <Text style={{ color: '#555' }}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

function ModuleScreen({ module, onBack }) {
  if (module.id === 1) {
    return <ModuleOne onBack={onBack} />;
  }
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Button title="Zurück" onPress={onBack} />
      <ScrollView>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 16 }}>{module.title}</Text>
        <Text style={{ fontSize: 16 }}>{module.description}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function ModuleOne({ onBack }) {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    SecureStore.getItemAsync('module1Entries').then((data) => {
      if (data) setEntries(JSON.parse(data));
    });
  }, []);

  const saveEntry = async () => {
    const newEntries = [...entries, { text: entry, date: new Date().toISOString() }];
    setEntries(newEntries);
    setEntry('');
    await SecureStore.setItemAsync('module1Entries', JSON.stringify(newEntries));
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Button title="Zurück" onPress={onBack} />
      <ScrollView>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 16 }}>Modul 1 – Einführung & Wahrnehmungsfilter</Text>
        <Text style={{ marginBottom: 16 }}>
          Notiere im Freuden-Check-Tagebuch kleine positive Momente, die du heute bemerkt hast.
        </Text>
        <TextInput
          placeholder="Was war heute positiv?"
          value={entry}
          onChangeText={setEntry}
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8 }}
        />
        <Button title="Speichern" onPress={saveEntry} disabled={!entry.trim()} />
        <Text style={{ marginVertical: 16, fontSize: 18, fontWeight: 'bold' }}>Einträge</Text>
        {entries.map((e, idx) => (
          <View key={idx} style={{ marginBottom: 8 }}>
            <Text>{new Date(e.date).toLocaleString()}</Text>
            <Text>{e.text}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  const [selected, setSelected] = useState(null);
  return selected ? (
    <ModuleScreen module={selected} onBack={() => setSelected(null)} />
  ) : (
    <ModuleList onSelect={setSelected} />
  );
}
