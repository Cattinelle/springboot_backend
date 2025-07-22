import MotivationIcon from "@/assets/svgs/Motivation and Self-Help.svg";
import EducationIcon from "@/assets/svgs/Learning and Education.svg";
import ProductivityIcon from "@/assets/svgs/Business and Productivity.svg";
import RelationshipsIcon from "@/assets/svgs/Relationships and Love.svg";
import SelfGrowthIcon from "@/assets/svgs/Self-Growth.svg";
import LeadershipIcon from "@/assets/svgs/Leadership.svg";
import FinanceIcon from "@/assets/svgs/Finance and Investing.svg";
import TechIcon from "@/assets/svgs/Societies and Tech.svg";
import { SvgProps } from "react-native-svg";

const categoryIcons: Record<string, React.FC<SvgProps>> = {
  "Motivation & Self-Help": MotivationIcon,
  "Business & Productivity": ProductivityIcon,
  "Societies & Tech": TechIcon,
  "Self-Growth": SelfGrowthIcon,
  "Leadership": LeadershipIcon,
  "Relationships & Love": RelationshipsIcon,
  "Finance & Investing": FinanceIcon,
  "Learning & Education": EducationIcon,
};

export default categoryIcons;
