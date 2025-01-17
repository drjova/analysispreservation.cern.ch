import React from "react";
import PropTypes from "prop-types";
import { Paragraph, Heading, Box } from "grommet";
import { AiOutlineDown } from "react-icons/ai";
import Menu from "../../../partials/Menu";
import { connect } from "react-redux";
import { handlePermissions } from "../../../../actions/draftItem";
import CheckBox from "grommet/components/CheckBox";

const PermissionPopUp = ({
  title,
  handlePermissions,
  draft_id,
  canAdmin,
  type,
  email,
  permissions,
  created_by,
  addPermissionsModal,
  hideMenu = false,
  updatePermissionsModalObj,
  loading,
  isOwner = false
}) => {
  const updateModalPermissions = permission => {
    if (permissions.includes(permission)) {
      permissions = permissions.filter(item => item !== permission);
    } else {
      permissions.push(permission);
    }
    updatePermissionsModalObj(permissions);
  };
  const contentDetails = [
    {
      checked: true,
      disabled: true,
      content: (
        <Box>
          <Heading tag="h5" margin="none" strong>
            Read
          </Heading>
          <Paragraph margin="none" size="small">
            Users can access a record to read metadata and post a review
          </Paragraph>
        </Box>
      ),
      onChange: null
    },
    {
      checked: permissions.includes("deposit-update"),
      disabled: loading || !canAdmin || (created_by && created_by === email),
      onChange: () =>
        addPermissionsModal
          ? updateModalPermissions("deposit-update")
          : handlePermissions(
              draft_id,
              type,
              email,
              "deposit-update",
              permissions.includes("deposit-update") ? "remove" : "add"
            ),
      content: (
        <Box>
          <Heading tag="h5" margin="none" strong>
            Write
          </Heading>
          <Paragraph margin="none" size="small">
            Users can read, edit, review metadata and upload files and wehooks
          </Paragraph>
        </Box>
      )
    },
    {
      checked: permissions.includes("deposit-admin"),
      disabled: loading || !canAdmin || (created_by && created_by === email),
      onChange: () =>
        addPermissionsModal
          ? updateModalPermissions("deposit-admin")
          : handlePermissions(
              draft_id,
              type,
              email,
              "deposit-admin",
              permissions.includes("deposit-admin") ? "remove" : "add"
            ),
      content: (
        <Box>
          <Heading tag="h5" margin="none" strong>
            Admin
          </Heading>
          <Paragraph margin="none" size="small">
            Users can read, edit, review metadata and upload files and wehooks,
            publish and delete
          </Paragraph>
        </Box>
      )
    }
  ];

  return (
    <Box
      direction="row"
      responsive={false}
      align="center"
      justify="center"
      className="permission-pop-up"
      style={{ overflow: "visible" }}
    >
      <Box>{title}</Box>
      {!hideMenu &&
        !isOwner && (
          <Menu
            shadow
            icon={
              <Box style={{ margin: "0 0 0 5px" }}>
                <AiOutlineDown size={15} />
              </Box>
            }
            padding=""
            top={23}
            right={0}
            background="#fff"
            hoverColor="#fff"
            minWidth="250px"
          >
            {contentDetails.map((item, index) => (
              <Box
                separator="bottom"
                direction="row"
                pad="small"
                responsive={false}
                key={index}
              >
                <CheckBox
                  className="permission_checkbox"
                  checked={item.checked}
                  disabled={item.disabled}
                  onChange={item.onChange}
                />

                {item.content}
              </Box>
            ))}
          </Menu>
        )}
    </Box>
  );
};

PermissionPopUp.propTypes = {
  title: PropTypes.string,
  handlePermissions: PropTypes.func,
  draft_id: PropTypes.string,
  canAdmin: PropTypes.bool,
  type: PropTypes.string,
  email: PropTypes.string,
  permissions: PropTypes.array,
  created_by: PropTypes.string,
  addPermissionsModal: PropTypes.bool,
  hideMenu: PropTypes.bool,
  updatePermissionsModalObj: PropTypes.func,
  loading: PropTypes.bool,
  isOwner: PropTypes.bool
};

const mapStateToProps = state => ({
  draft_id: state.draftItem.get("id"),
  created_by: state.draftItem.get("created_by"),
  draft: state.draftItem.get("data"),
  loading: state.draftItem.get("loading"),
  canAdmin: state.draftItem.get("can_admin")
});

function mapDispatchToProps(dispatch) {
  return {
    handlePermissions: (draft_id, type, email, action, operation) =>
      dispatch(handlePermissions(draft_id, type, email, action, operation))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PermissionPopUp);
