import WidgetKit
import SwiftUI

struct WidgetData: Codable {
  let bgColor: String
  let textColor: String
  let textFont: String
  let horoscope: String
  
  // Default values if data can't be loaded
  static let `default` = WidgetData(
    bgColor: "#000000",
    textColor: "#FFFFFF",
    textFont: "system",
    horoscope: "Open the app to see your horoscope"
  )
}

// Read from App Group
func loadWidgetData() -> WidgetData {
  let appGroupID = "group.KnT.DailyHoroscope"
  
  guard let userDefaults = UserDefaults(suiteName: appGroupID) else {
    return WidgetData.default
  }
  
  guard let jsonString = userDefaults.string(forKey: "widgetData") else {
    return WidgetData.default
  }
  
  print("✅ Found data: \(jsonString)")
  
  guard let jsonData = jsonString.data(using: .utf8) else {
    return WidgetData.default
  }
  
  do {
    let decoder = JSONDecoder()
    let widgetData = try decoder.decode(WidgetData.self, from: jsonData)
    return widgetData
  } catch {
    return WidgetData.default
  }
}

import SwiftUI

extension Color {
    init(hex: String) {
        let scanner = Scanner(string: hex)
        _ = scanner.scanString("#")

        var rgb: UInt64 = 0
        scanner.scanHexInt64(&rgb)

        let red = Double((rgb >> 16) & 0xFF) / 255.0
        let green = Double((rgb >> 8) & 0xFF) / 255.0
        let blue = Double(rgb & 0xFF) / 255.0

        self.init(red: red, green: green, blue: blue)
    }
}

struct Provider: TimelineProvider {
  func placeholder(in context: Context) -> SimpleEntry {
    SimpleEntry(
      date: Date(),
      widgetData: WidgetData.default
    )
  }
  
  func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
    let widgetData = loadWidgetData()
    let entry = SimpleEntry(
      date: Date(),
      widgetData: widgetData
    )
    completion(entry)
  }
  
  func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
    var entries: [SimpleEntry] = []
    let widgetData = loadWidgetData()
    let currentDate = Date()
    
    for hourOffset in 0 ..< 5 {
      let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
      let entry = SimpleEntry(
        date: entryDate,
        widgetData: widgetData
      )
      entries.append(entry)
    }
    
    let timeline = Timeline(entries: entries, policy: .atEnd)
    completion(timeline)
  }
}

struct SimpleEntry: TimelineEntry {
  let date: Date
  let widgetData: WidgetData
}

struct widgetEntryView : View {
  var entry: Provider.Entry
  
  var body: some View {
      VStack {
        Text("\(entry.widgetData.horoscope)")
          .font(getFontForFamily(entry.widgetData.textFont))
          .foregroundStyle(Color(hex: entry.widgetData.textColor))
          .multilineTextAlignment(.center)
          .minimumScaleFactor(0.5)
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity)
  }
  
  
  // Helper function to map font family names
  private func getFontForFamily(_ fontFamily: String) -> Font {
    switch fontFamily.lowercased() {
    case "system":
      return .system(size: 20, weight: .regular)
    case "roboto":
      return .custom("Roboto-Regular", size: 20)
    case "opensans":
      return .custom("OpenSans-Regular", size: 20)
    case "fuzzybubbles":
      return .custom("FuzzyBubbles-Regular", size: 20)
    case "creepster":
      return .custom("Creepster-Regular", size: 20)
    case "delius":
      return .custom("Delius-Regular", size: 20)
    case "monoton":
      return .custom("Monoton-Regular", size: 20)
    case "montserrat":
      return .custom("Montserrat-Regular", size: 20)
    case "playfair", "playfairdisplay":
      return .custom("PlayfairDisplay-Regular", size: 20)
    case "sansation":
      return .custom("Sansation-Regular", size: 20)
    case "specialelite":
      return .custom("SpecialElite-Regular", size: 20)
    case "vt323":
      return .custom("VT323-Regular", size: 20)
    default:
      return .system(size: 20, weight: .regular)
    }
  }
}

struct widget: Widget {
  let kind: String = "widget"
  
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      widgetEntryView(entry: entry)
        .containerBackground(for: .widget) {
          Color(hex: entry.widgetData.bgColor)
        }
    }
  }
}

#Preview(as: .systemSmall) {
  widget()
} timeline: {
  SimpleEntry(date: .now, widgetData: WidgetData.default)
  SimpleEntry(date: .now, widgetData: WidgetData.default)
}