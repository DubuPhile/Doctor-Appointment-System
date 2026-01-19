import { Modal } from "antd";

export const confirmAction = ({
  title = "Are you sure?",
  content = "This action cannot be undone.",
  okText = "Confirm",
  okType = "danger",
  cancelText = "Cancel",
  onOk,
}) => {
  Modal.confirm({
    title,
    content,
    okText,
    okType,
    cancelText,
    onOk,
  });
};
