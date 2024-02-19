/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useMemo, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {useSharedValue} from 'react-native-reanimated';
import {Slider} from 'react-native-awesome-slider';

import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {saveHabit, habitCount, observeHabits, allHabits} from './model/helper';
import {withObservables} from '@nozbe/watermelondb/react';

const Stack = createNativeStackNavigator();

function Section({children, title}) {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const HabitList = ({habits}) => {
  return (
    <View
      style={{
        backgroundColor: Colors.darker,
      }}>
      {habits.map(habit => {
        return (
          <Section key={habit.id} title={habit.title}>
            {habit.icon} | {habit.verb}
          </Section>
        );
      })}
    </View>
  );
};

function HabitOverview({navigation}) {
  const isDarkMode = useColorScheme() === 'dark';

  const [totalHabit, setTotalHabit] = useState(0);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleOnPress = () => {
    navigation.navigate('NewHabit', {habitId: '1234'});
  };

  const progress = useSharedValue(30);
  const min = useSharedValue(0);
  const max = useSharedValue(100);

  (async () => {
    setTotalHabit(await habitCount());
  })();
  const enhance = withObservables([], () => ({
    habits: observeHabits(),
  }));

  const EnhancedHabits = enhance(HabitList);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Badtrack">For the ones fueled by negativity</Section>
        </View>
        <Text style={{color: Colors.lighter, fontSize: 14}}>
          Total bad habit : {totalHabit}
        </Text>
        <EnhancedHabits />
        <Button onPress={handleOnPress} title="New" color={'#2e2e2e'} />
        <Slider
          style={{height: 20}}
          progress={progress}
          minimumValue={min}
          maximumValue={max}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function NewHabit({navigation, route}) {
  const [habitName, setHabitName] = useState('');
  const [habitIcon, setHabitIcon] = useState('');
  const [habitVerb, setHabitVerb] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePress = async () => {
    setIsSaving(true);
    await saveHabit(habitName, habitIcon, habitVerb);
    setHabitName('');
    setHabitIcon('');
    setHabitVerb('');
    setIsSaving(false);
    navigation.navigate('HabitOverview');
  };

  return (
    <Section title="New Habit">
      <View style={{padding: 10, backgroundColor: Colors.black}}>
        <TextInput
          style={{
            borderColor: '#010101',
            marginVertical: 8,
            marginHorizontal: 4,
            height: 40,
          }}
          placeholder="Habit name (like Smoking)"
          onChangeText={nt => setHabitName(nt)}
        />
        <TextInput
          style={{marginVertical: 8, marginHorizontal: 4, height: 40}}
          placeholder="Icon to represent your habit"
          onChangeText={nt => setHabitIcon(nt)}
        />
        <TextInput
          style={{marginVertical: 8, marginHorizontal: 4, height: 40}}
          placeholder="Habit verb (like Smoked)"
          onChangeText={nt => setHabitVerb(nt)}
        />
      </View>
      <Section title={habitName}>
        Id: {route.params.habitId} | Icon: {habitIcon} | Verb: {habitVerb}
      </Section>
      <Button title="Save" disabled={isSaving} onPress={handleSavePress} />
      <Button
        title="Cancel"
        onPress={() => navigation.navigate('HabitOverview')}
      />
    </Section>
  );
}
function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HabitOverview">
          <Stack.Screen name="HabitOverview" component={HabitOverview} />
          <Stack.Screen name="NewHabit" component={NewHabit} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
