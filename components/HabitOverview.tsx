export default function HabitOverview({}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleOnPress = () => {
    Alert.alert('Button Pressed');
  };

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
        <View
          style={{
            width: 150,
            height: 150,
            borderRadius: 4,
            padding: 1,
            marginTop: 2,
            backgroundColor: Colors.white,
          }}>
          <Text style={{color: Colors.black, fontSize: 20}}>Smoking</Text>
          <Button onPress={handleOnPress} title="Open" color={'#2e2e2e'} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
