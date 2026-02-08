import { EuchreRank, EuchreSuit } from "../lib/euchre/index";
import "./CardComponent.css";

import spadesA from "../assets/images/Cards/spadesA.svg";
import spades2 from "../assets/images/Cards/spades2.svg";
import spades3 from "../assets/images/Cards/spades3.svg";
import spades4 from "../assets/images/Cards/spades4.svg";
import spades5 from "../assets/images/Cards/spades5.svg";
import spades6 from "../assets/images/Cards/spades6.svg";
import spades7 from "../assets/images/Cards/spades7.svg";
import spades8 from "../assets/images/Cards/spades8.svg";
import spades9 from "../assets/images/Cards/spades9.svg";
import spades10 from "../assets/images/Cards/spades10.svg";
import spadesJ from "../assets/images/Cards/spadesJ.svg";
import spadesQ from "../assets/images/Cards/spadesQ.svg";
import spadesK from "../assets/images/Cards/spadesK.svg";
import diamondsA from "../assets/images/Cards/diamondsA.svg";
import diamonds2 from "../assets/images/Cards/diamonds2.svg";
import diamonds3 from "../assets/images/Cards/diamonds3.svg";
import diamonds4 from "../assets/images/Cards/diamonds4.svg";
import diamonds5 from "../assets/images/Cards/diamonds5.svg";
import diamonds6 from "../assets/images/Cards/diamonds6.svg";
import diamonds7 from "../assets/images/Cards/diamonds7.svg";
import diamonds8 from "../assets/images/Cards/diamonds8.svg";
import diamonds9 from "../assets/images/Cards/diamonds9.svg";
import diamonds10 from "../assets/images/Cards/diamonds10.svg";
import diamondsJ from "../assets/images/Cards/diamondsJ.svg";
import diamondsQ from "../assets/images/Cards/diamondsQ.svg";
import diamondsK from "../assets/images/Cards/diamondsK.svg";
import heartsA from "../assets/images/Cards/heartsA.svg";
import hearts2 from "../assets/images/Cards/hearts2.svg";
import hearts3 from "../assets/images/Cards/hearts3.svg";
import hearts4 from "../assets/images/Cards/hearts4.svg";
import hearts5 from "../assets/images/Cards/hearts5.svg";
import hearts6 from "../assets/images/Cards/hearts6.svg";
import hearts7 from "../assets/images/Cards/hearts7.svg";
import hearts8 from "../assets/images/Cards/hearts8.svg";
import hearts9 from "../assets/images/Cards/hearts9.svg";
import hearts10 from "../assets/images/Cards/hearts10.svg";
import heartsJ from "../assets/images/Cards/heartsJ.svg";
import heartsQ from "../assets/images/Cards/heartsQ.svg";
import heartsK from "../assets/images/Cards/heartsK.svg";
import clubsA from "../assets/images/Cards/clubsA.svg";
import clubs2 from "../assets/images/Cards/clubs2.svg";
import clubs3 from "../assets/images/Cards/clubs3.svg";
import clubs4 from "../assets/images/Cards/clubs4.svg";
import clubs5 from "../assets/images/Cards/clubs5.svg";
import clubs6 from "../assets/images/Cards/clubs6.svg";
import clubs7 from "../assets/images/Cards/clubs7.svg";
import clubs8 from "../assets/images/Cards/clubs8.svg";
import clubs9 from "../assets/images/Cards/clubs9.svg";
import clubs10 from "../assets/images/Cards/clubs10.svg";
import clubsJ from "../assets/images/Cards/clubsJ.svg";
import clubsQ from "../assets/images/Cards/clubsQ.svg";
import clubsK from "../assets/images/Cards/clubsK.svg";
import back from "../assets/images/Cards/back.svg";

const cardImages: any = {
  spadesA: spadesA,
  spades2: spades2,
  spades3: spades3,
  spades4: spades4,
  spades5: spades5,
  spades6: spades6,
  spades7: spades7,
  spades8: spades8,
  spades9: spades9,
  spades10: spades10,
  spadesJ: spadesJ,
  spadesQ: spadesQ,
  spadesK: spadesK,
  diamondsA: diamondsA,
  diamonds2: diamonds2,
  diamonds3: diamonds3,
  diamonds4: diamonds4,
  diamonds5: diamonds5,
  diamonds6: diamonds6,
  diamonds7: diamonds7,
  diamonds8: diamonds8,
  diamonds9: diamonds9,
  diamonds10: diamonds10,
  diamondsJ: diamondsJ,
  diamondsQ: diamondsQ,
  diamondsK: diamondsK,
  heartsA: heartsA,
  hearts2: hearts2,
  hearts3: hearts3,
  hearts4: hearts4,
  hearts5: hearts5,
  hearts6: hearts6,
  hearts7: hearts7,
  hearts8: hearts8,
  hearts9: hearts9,
  hearts10: hearts10,
  heartsJ: heartsJ,
  heartsQ: heartsQ,
  heartsK: heartsK,
  clubsA: clubsA,
  clubs2: clubs2,
  clubs3: clubs3,
  clubs4: clubs4,
  clubs5: clubs5,
  clubs6: clubs6,
  clubs7: clubs7,
  clubs8: clubs8,
  clubs9: clubs9,
  clubs10: clubs10,
  clubsJ: clubsJ,
  clubsQ: clubsQ,
  clubsK: clubsK,
  back: back,
};
interface CardProps {
  suit: EuchreSuit;
  rank: EuchreRank;
  index: number;
  flippedUp?: boolean;
  onClick?: (index: number) => void;
  className?: string;
}

const Card = ({
  suit,
  rank,
  index,
  onClick,
  flippedUp = true,
  className,
}: CardProps) => {
  const imgPath = `${suit.toLowerCase()}${rank}`;
  const cardImage = flippedUp ? cardImages[imgPath] : back;

  return (
    <img
      onClick={() => onClick && onClick(index)}
      className={`card ${className}`}
      src={cardImage}
    />
  );
};
export default Card;
