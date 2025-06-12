import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const cardVariants = {
  hidden: { y: 20, opacity: 0 }, // Start slightly below and invisible
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

interface NewThunkCardProps {
  isVisible: boolean;
}

const NewThunkCard = ({ isVisible }: NewThunkCardProps) => {
  const navigate = useNavigate()

  const handleStartButton = () => {
    navigate('/newentry')
  }

  return (
    <motion.div
      className="box has-background-white-ter py-5 px-6"
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      exit="hidden" // For AnimatePresence when parent changes visibility
      style={{ opacity: 0.9, maxWidth: '300px', margin: '1rem auto' }}
    >
      <h3 className="title is-4 has-text-grey-dark">New</h3>
      <p className="subtitle is-6 has-text-grey-dark"></p>
      <button className="button is-primary is-fullwidth mt-4" onClick={handleStartButton}>Start</button>
    </motion.div>
  );
};

export default NewThunkCard;