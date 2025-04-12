import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

const tabs = ["Cây trồng", "Ưa bóng", "Hạt giống", "Hybrid"];

const PlantDetailScreen = () => {
  const [activeTab, setActiveTab] = useState("Cây trồng");
  const [showStages, setShowStages] = useState(false);
  const [showKnowledge, setShowKnowledge] = useState(false);
  const [expandedKnowledgeItems, setExpandedKnowledgeItems] = useState<number[]>([]);

  const [expandedStageItems, setExpandedStageItems] = useState<number[]>([]);

  const toggleKnowledgeItem = (index: number) => {
    if (expandedKnowledgeItems.includes(index)) {
      setExpandedKnowledgeItems(expandedKnowledgeItems.filter((i) => i !== index));
    } else {
      setExpandedKnowledgeItems([...expandedKnowledgeItems, index]);
    }
  };

  const toggleStageItem = (index: number) => {
    if (expandedStageItems.includes(index)) {
      setExpandedStageItems(expandedStageItems.filter((i) => i !== index));
    } else {
      setExpandedStageItems([...expandedStageItems, index]);
    }
  };

  const knowledgeSteps = [
    {
      title: "Bước 1: Chuẩn bị vật dụng, chất trồng",
      content: "- Chậu nhựa có lỗ...\n- Giá thể trồng như xơ dừa, đất sạch,...",
    },
    {
      title: "Bước 2: Tiến hành gieo hạt",
      content: "- Ngâm hạt trước 6-8 tiếng...\n- Gieo đều, phủ lớp đất mỏng.",
    },
    {
      title: "Bước 3: Chăm sóc sau khi gieo hạt",
      content: "- Tưới nước sương mù...\n- Đảm bảo ánh sáng và độ ẩm.",
    },
  ];

  const growthStages = [
    {
      title: "1. Ngâm Hạt và Ủ Hạt (48 tiếng)",
      content: "- Ngâm hạt trong nước ấm khoảng 8-12h...\n- Sau đó ủ trong khăn ẩm.",
    },
    {
      title: "2. Nảy Mầm (3-5 ngày)",
      content: "- Đặt hạt ủ ở nơi ấm áp...\n- Hạt sẽ nứt và nhú mầm nhỏ.",
    },
    {
      title: "3. Bắt Đầu Phát Triển (2-3 tuần)",
      content: "- Mầm dài ra và phát triển lá mầm...\n- Bắt đầu ánh sáng trực tiếp nhẹ.",
    },
    {
      title: "4. Trưởng Thành (4-6 tuần)",
      content: "- Cây phát triển đầy đủ bộ lá...\n- Có thể chuyển chậu lớn hơn.",
    },
    {
      title: "5. Ra Hoa (4-6 tuần)",
      content: "- Đủ điều kiện nhiệt độ và ánh sáng...\n- Cây sẽ bắt đầu nở hoa.",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Panse Den</Text>
  
      <Image
        source={{ uri: "https://noithatduyphat.vn/wp-content/uploads/2019/02/tuoi-nao-dat-cay-xuong-rong-tren-ban-lam-viec-la-tot-nhat-1.jpg" }}
        style={styles.image}
      />
  
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
  
      {/* Kiến thức cơ bản */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => setShowKnowledge(!showKnowledge)}
          style={styles.accordionHeader}
        >
          <Text style={styles.sectionTitle}>Kiến thức cơ bản</Text>
          <Text style={styles.accordionArrow}>{showKnowledge ? "▾" : "▸"}</Text>
        </TouchableOpacity>
  
        {showKnowledge &&
          knowledgeSteps.map((step, index) => (
            <View key={index}>
              <TouchableOpacity
                onPress={() => toggleKnowledgeItem(index)}
                style={styles.accordionHeader}
              >
                <Text style={styles.accordionTitle}>{step.title}</Text>
                <Text style={styles.accordionArrow}>
                  {expandedKnowledgeItems.includes(index) ? "▾" : "▸"}
                </Text>
              </TouchableOpacity>
              {expandedKnowledgeItems.includes(index) && (
                <Text style={styles.accordionContent}>{step.content}</Text>
              )}
            </View>
          ))}
      </View>
  
      {/* Các giai đoạn */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => setShowStages(!showStages)}
          style={styles.accordionHeader}
        >
          <Text style={styles.sectionTitle}>Các giai đoạn</Text>
          <Text style={styles.accordionArrow}>{showStages ? "▾" : "▸"}</Text>
        </TouchableOpacity>
  
        {showStages &&
          growthStages.map((stage, index) => (
            <View key={index}>
              <TouchableOpacity
                onPress={() => toggleStageItem(index)}
                style={styles.accordionHeader}
              >
                <Text style={styles.accordionTitle}>{stage.title}</Text>
                <Text style={styles.accordionArrow}>
                  {expandedStageItems.includes(index) ? "▾" : "▸"}
                </Text>
              </TouchableOpacity>
              {expandedStageItems.includes(index) && (
                <Text style={styles.accordionContent}>{stage.content}</Text>
              )}
            </View>
          ))}
      </View>
    </ScrollView>
  );
  
};

export default PlantDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  tabContainer: {
    flexDirection: "row",
    marginTop: 16,
    flexWrap: "wrap",
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginRight: 10,
    marginBottom: 10,
  },
  activeTab: {
    backgroundColor: "#2e7d32",
  },
  tabText: {
    color: "#333",
  },
  activeTabText: {
    color: "#fff",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  accordionTitle: {
    fontSize: 16,
  },
  accordionArrow: {
    fontSize: 18,
  },
  accordionContent: {
    paddingVertical: 8,
    fontSize: 14,
    color: "#555",
    paddingLeft: 8,
  },
});
