// import type { FC } from "react";
// import { Button, Card } from "react-bootstrap";
// import { InputField } from "../components/inputField";
// import {
//   addCostToRequest,
//   fetchCostRequestInfo,
// } from "../store/costRequestSlice";
// import { useSelector, useDispatch } from "react-redux";
// import type { RootState, AppDispatch } from "../store";

// interface Props {
//   title: string;
//   image_url: string;
//   buttonClickHandler: () => void;

//   variant?: "default" | "request";

//   first_dimension_name?: string;
//   input_field_1?: number;
//   input_field_2?: number;
//   second_dimension_name?: string;
//   cost_id?: number;
//   cost_result?: number;
// }

// export const CostCard: FC<Props> = ({
//   title,
//   image_url,
//   buttonClickHandler,
//   variant = "default",
//   first_dimension_name,
//   input_field_1,
//   input_field_2,
//   second_dimension_name,
//   cost_result,
//   cost_id,
// }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const isAuthorized = useSelector(
//     (state: RootState) => state.user.isAuthorized,
//   );

//   const handleAdd = async () => {
//     if (cost_id) {
//       await dispatch(addCostToRequest(cost_id));
//       await dispatch(fetchCostRequestInfo()); // Для обновления отображения состояния иконки "корзины"
//     }
//   };
//   if (variant === "default") {
//     return (
//       <Card className="cost-card">
//         <Card.Img
//           className="card-image"
//           variant="top"
//           src={image_url || "/IAD-frontend/stock.jpg"}
//           height={100}
//           width={100}
//           onClick={buttonClickHandler}
//         />
//         <Card.Body>
//           <div className="card-title">
//             <Card.Title>{title}</Card.Title>
//           </div>
//           <Button
//             className="add-btn"
//             onClick={isAuthorized == true ? handleAdd : undefined}
//             variant="primary"
//           >
//             Добавить
//           </Button>
//           <Button
//             className="details-btn"
//             onClick={buttonClickHandler}
//             variant="primary"
//           >
//             Подробнее
//           </Button>
//         </Card.Body>
//       </Card>
//     );
//   }

//   if (variant === "request") {
//     return (
//       <div className="cost-card cost-card--horizontal">
//         <Card className="cost-card">
//           <div className="card-info">
//             <Card.Img
//               className="card-image"
//               variant="top"
//               src={image_url || "/IAD-frontend/stock.jpg"}
//               height={100}
//               width={100}
//               onClick={buttonClickHandler}
//             />

//             <Card.Body>
//               <div className="card-title">
//                 <Card.Title>{title}</Card.Title>
//               </div>
//               <Button
//                 className="details-btn"
//                 onClick={buttonClickHandler}
//                 variant="primary"
//               >
//                 Подробнее
//               </Button>
//             </Card.Body>
//           </div>

//           {/* Первое поле ввода */}
//           <div className="cost-card--input">
//             <p className="cost-card--input-dimentions">
//               {first_dimension_name}
//             </p>
//             <div className="cost-card--inputField">
//               <InputField
//                 value={input_field_1 || ""}
//                 searchField={false}
//                 placeholder="Введите значение"
//               />
//             </div>
//           </div>

//           {/* Второе поле ввода */}
//           <div className="cost-card--input">
//             <p className="cost-card--input-dimentions">
//               {second_dimension_name}
//             </p>
//             <div className="cost-card--inputField">
//               <InputField
//                 value={input_field_2 || ""}
//                 searchField={false}
//                 placeholder="Введите значение"
//               />
//             </div>
//           </div>
//           <p className="cost-card--result">
//             Выбросы CO2 на этапе: {cost_result}
//           </p>
//         </Card>
//       </div>
//     );
//   }
// };
