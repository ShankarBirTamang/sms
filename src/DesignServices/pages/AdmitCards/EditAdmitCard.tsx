import { useParams } from "react-router-dom";
import useAdmitCard from "../../hooks/useAdmitCard";
import { useEffect } from "react";

const EditAdmitCard = () => {
  const params = useParams();
  const id = Number(params.admitCardId);
  const { getOneAdmitCard, admitCard } = useAdmitCard({});

  useEffect(() => {
    getOneAdmitCard(id);
  }, [id]);

  return <div>EditAdmitCard</div>;
};

export default EditAdmitCard;
