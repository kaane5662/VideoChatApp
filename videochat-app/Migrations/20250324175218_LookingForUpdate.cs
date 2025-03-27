using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace videochat_app.Migrations
{
    /// <inheritdoc />
    public partial class LookingForUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Avaliability",
                table: "LookingForProfiles",
                newName: "Availability");

            migrationBuilder.AddColumn<string>(
                name: "Experience",
                table: "LookingForProfiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string[]>(
                name: "Skills",
                table: "LookingForProfiles",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Timezone",
                table: "LookingForProfiles",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Experience",
                table: "LookingForProfiles");

            migrationBuilder.DropColumn(
                name: "Skills",
                table: "LookingForProfiles");

            migrationBuilder.DropColumn(
                name: "Timezone",
                table: "LookingForProfiles");

            migrationBuilder.RenameColumn(
                name: "Availability",
                table: "LookingForProfiles",
                newName: "Avaliability");
        }
    }
}
